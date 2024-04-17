from django.urls import path
from .views import CartView, CheckoutView, StripeCancelView, StripeSuccessView, stripe_webhook
# add the stripe success and cancel views
urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('checkout/', CheckoutView.as_view(), name='cart_checkout'),
    path('stripe/success/', StripeSuccessView.as_view(), name='stripe_success'),
    path('stripe/cancel/', StripeCancelView.as_view(), name='stripe_cancel'),
    path('stripe/webhook/', stripe_webhook, name='stripe_webhook')
]