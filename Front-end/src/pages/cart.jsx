import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../utilities';
import { Card, Button, Modal } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
// import { Stripe_pub_key } from '../../utilities';


const stripePromise = loadStripe('pk_test_51P4k6MESpb9S7WlJavRKQRVgqZVozI7wxQKwq8MjnpBfPQxBKSX4AsI6Xc7AyRqFwVjXEp263IA647JPZCt5IoET00gr5j4UEo')


function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [total_price, setTotalPrice] = useState(0.0);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/my_cart/cart/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
                });
                console.log("response.data", response.data)
                console.log("Cart items:", response.data.carts); 
                setCartItems(response.data.carts);
                calculateTotalPrice(response.data.carts);
            } catch (error) {
                console.error('Failed to fetch cart items', error);
            }
        };
        fetchCartItems();
    }, []);


    const removeFromCart = async (cartItemId) => {
        try{
            const response = await api.delete(`/my_cart/manage_cart/${cartItemId}/`, {
                // data: { trip: cartItemId },
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }    
            });
            if(response.status === 204)
            // setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== cartItemId));
            setCartItems(cartItems.filter(item => item.id !== cartItemId));
            calculateTotalPrice(cartItems.filter(item => item.id !== cartItemId));
            alert('Trip removed from cart');
        } catch (error) {
            console.error('Failed to remove trip from cart', error);
            alert('Failed to remove trip from cart. Check console for more information.');
        }
    };

const calculateTotalPrice = (items) => {
    let total = 0.0
    items.forEach(item => {
        total += parseFloat(item.trip_price)
    });
    setTotalPrice(total);
};
   

const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/checkout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total_price }),
    });
    const { clientSecret } = await response.json();
        const result = await stripe.confirmCardPayment(clientSecret);
        if (result.error) {
            console.error(result.error.message);
            alert('Payment failed. Please try again.');
        } else {
            alert('Payment successful!');
            //Clear cart items after successful payment
            setCartItems([]);
            setTotalPrice(0.0);
        }
    };


    return (
        <div>
            <h1>My Cart</h1>
            <div className="checkout-container">
                <h2>Checkout</h2>
                <p>Total Price: ${total_price.toFixed(2)}</p>
                <Link to='/checkout' className='checkout-button'> Checkout </Link>
            </div>
            {cartItems.length > 0 ? (
                cartItems.map(item => (
                    <Card key={item.id}>
                        <Card.Body>
                            <Card.Title>{item.trip}</Card.Title>
                            <Card.Text>
                                Price: ${parseFloat(item.trip_price).toFixed(2)}
                            </Card.Text>
                            {/* <Card.Text>
                                Total Price: ${parseFloat(item.total_price).toFixed(2)}
                            </Card.Text> */}
                            
                            <Button variant="danger" onClick={() => removeFromCart(item.id)}>Remove from Cart</Button>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
}

export default CartPage;