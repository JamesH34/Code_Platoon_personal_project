import stripe
from django.conf import settings
from dotenv import dotenv_values


env=dotenv_values(".env")
stripe.api_key = env.get("STRIPE_API_KEY")


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


def handle_checkout_session(session):
    # Fulfill the purchase...
    pass


# do the calculations on the front end
def update_total_price(cart_items):
    total_price = 0.0
    for item in cart_items:
        # Convert the string price to a float and add it to the total
        total_price += float(item['trip_price'])
        
    return total_price


# def update_total_price(cart):
#     return cart.trip_price
# def update_total_price_for_cart(cart):
#     return float(cart.total_price)