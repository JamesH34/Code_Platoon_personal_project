import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51P4k6MESpb9S7WlJavRKQRVgqZVozI7wxQKwq8MjnpBfPQxBKSX4AsI6Xc7AyRqFwVjXEp263IA647JPZCt5IoET00gr5j4UEo');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            // Make a call to the backend to process the payment
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Please Enter Your Card Details</h1>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
    );
};

const CheckoutPage = () => {
    return (
        <Elements stripe={stripePromise}>
            
            <CheckoutForm />
        </Elements>
    );
};

export default CheckoutPage;