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
from .utils import update_total_price, create_stripe_checkout_session


# Create your views here.
class CartView(APIView):
    #  create new cart using the cart serializer
    def post(self, request, *args, **kwargs):
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

# simple get method to show the user what is in the cart
    def get(self, request, *args, **kwargs):
        carts = Cart.objects.all()
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

# allow the user to update or adjust things in the cart.
    def put(self, request, *args, **kwargs):
        cart = Cart.objects.get(id=request.data['id'])
        serializer = CartSerializer(cart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

# remove an item from the cart
    def delete(self, request, *args, **kwargs):
        cart = Cart.objects.get(id=request.data['id'])
        cart.delete()
        return Response(status=HTTP_204_NO_CONTENT)
    

# create a stripe checkout session
    def post_checkout(self, request, *args, **kwargs):
        cart_id = request.data.get('id')
        if not cart_id:
            return Response({'error': 'Cart ID is required'}, status=HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(id=cart_id)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=HTTP_404_NOT_FOUND)

        session = create_stripe_checkout_session(cart)
        if isinstance(session, dict) and 'id' in session:
            return Response({'sessionId': session['id']}, status=HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to create checkout session'}, status=HTTP_500_INTERNAL_SERVER_ERROR)
