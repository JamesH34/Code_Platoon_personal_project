from rest_framework.response import Response    
from rest_framework.views import APIView
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_401_UNAUTHORIZED,
    HTTP_500_INTERNAL_SERVER_ERROR
)   
from .serializers import CartSerializer
from .models import Cart
from .utils import update_total_price, create_stripe_checkout_session, handle_checkout_session
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
import json
import logging
from dotenv import dotenv_values
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated


env=dotenv_values(".env")
stripe.api_key = env.get("STRIPE_API_KEY")
logger = logging.getLogger(__name__)


# Create your views here.
class CartView(APIView):
    permission_classes = [IsAuthenticated]
    #  create new cart using the cart serializer
    def post(self, request, *args, **kwargs):
        print('POST data recieved:', request.data)  
        serializer = CartSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            cart_item = serializer.save()
            print("serializer data after save:", serializer.data)
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            print("serializer errors:", serializer.errors)
            logger.error(f'Cart creation failed: {serializer.errors}')
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        
# simple get method to show the user what is in the cart
    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        carts = Cart.objects.filter(user=user_id).values()
        # total_price = update_total_price(serializer.data.carts)  
        total_price = 0.0
        for item in carts:
            total_price += float(item.get('trip_price', 0.0))
        return Response({
            "carts": carts,
            "total_price": f"${total_price:.2f}"
        }, status=HTTP_200_OK)

# allow the user to update or adjust things in the cart.
    def put(self, request, *args, **kwargs):
        cart = Cart.objects.get(id=request.data['id'])
        serializer = CartSerializer(cart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        else:
            logger.error(f'Cart update failed: {serializer.errors}')
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

# remove an item from the cart
class CartItemDeleteView(APIView):
    def delete(self, request, cart_item_id):
            cart_item = get_object_or_404(Cart, id=cart_item_id, user=request.user)
            cart_item.delete()
            logger.debug(f"Deleted cart item with ID: {cart_item_id}")
            return Response(status=HTTP_204_NO_CONTENT)


# create a stripe checkout session
class CheckoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            cart_items = request.data.get('carts', [])

            # Create a list of Stripe line items from cart data
            line_items = [{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"Trip ID {item['trip']}",  # Customizing the product name
                    },
                    'unit_amount_decimal': int(float(item['trip_price']) * 100),  # Convert price to cents
                },
                'quantity': 1,  # This example assumes each line item has a quantity of 1
            } for item in cart_items]

            # Create a checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://127.0.0.1:8000/api/v1/my_cart/stripe/success/',
                cancel_url='http://127.0.0.1:8000/api/v1/my_cart/stripe/cancel/',
            )

            return Response({'session_id': checkout_session['id']})
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)


#  set up the stripe success and cancel views

class StripeSuccessView(APIView):
    def get(self, request, *args, **kwargs):
        logger.info('Payment successful')
        return Response({'message': 'Payment successful'}, status=HTTP_200_OK)
    
class StripeCancelView(APIView):
    def get(self, request, *args, **kwargs):
        logger.info('Payment cancelled')
        return Response({'message': 'Payment cancelled'}, status=HTTP_200_OK)
    

@csrf_exempt #this is because info is coming from stripe, which will not have a token
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = env.get("STRIPE_ENDPOINT_SECRET")

    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
        logger.info(f"Handled webhook event: {event['type']}")
    except ValueError as e:
        logger.error(f"Webhook error - Invalid payload: {e}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Webhook error - Invalid signature: {e}")
        return HttpResponse(status=400)

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        # Fulfill the purchase...
        handle_checkout_session(session)

    return HttpResponse(status=200)