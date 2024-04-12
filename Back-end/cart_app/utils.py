import stripe
from django.conf import settings
from dotenv import dotenv_values


env=dotenv_values(".env")
stripe.api_key = env.get("STRIPE_SECRET_KEY")


def create_stripe_checkout_session(cart):
    try:
        # convert dollars to cents for stripe
        amount_in_cents = int(cart.total_price * 100)

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Custom Cart Checkout',
                    },
                    'unit_amount': amount_in_cents,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=settings.STRIPE_SUCCESS_URL,
            cancel_url=settings.STRIPE_CANCEL_URL,
        )
        return session
    except Exception as e:
        return str(e)



# do the calculations on the front end
def update_total_price(cart):
    if hasattr(cart, 'items'):  
        total_price = sum(item.trip_price for item in cart.items.all())
    else:
        total_price = cart.trip_price  
    return total_price
