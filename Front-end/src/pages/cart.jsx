import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../utilities';
import { Card, Button, Modal } from 'react-bootstrap';


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

            <Modal show={true} backdrop="static" keyboard={false}>
            <Modal.Header>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Total Price: ${total_price.toFixed(2)}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" >Checkout</Button>
                </Modal.Footer>
            
            </Modal>
        </div>
    );
}

export default CartPage;