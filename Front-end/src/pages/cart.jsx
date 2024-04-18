import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utilities';
import { Card, Button } from 'react-bootstrap';


function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/my_cart/cart/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
                });
                console.log("response.data", response.data)
                console.log("Cart items:", response.data.carts); 
                setCartItems(response.data.carts);
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
            setCartItems(cartItems.filter(item => item.id !== cartItemId));
            alert('Trip removed from cart');
        } catch (error) {
            console.error('Failed to remove trip from cart', error);
            alert('Failed to remove trip from cart. Check console for more information.');
        }
    };


   

    return (
        <div>
            <h1>My Cart</h1>
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