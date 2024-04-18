import { useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import api from '../../utilities';


function TripsPage() {
    const [trips, setTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({
        id: '',
        start_date: '',
        end_date: '',
        total_cost: '',
        bike: '',
        user: '',
    });
    const [cartItems, setCartItems] = useState([]);
    

    useEffect(() => {
        const fetchTrips = async () => {
            try{
                const response = await api.get('trips/view_trips/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
                });
                setTrips(response.data);
            } catch (error) {
                console.error('Failed to fetch trips', error);
            }   
        };
        fetchTrips();
    }, []);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await api.get('/my_cart/cart/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
                });
                setCartItems(response.data.carts); 
            } catch (error) {
                console.error('Failed to fetch cart items', error);
            }
        };
        fetchCartItems();
    }, []);

  


    const handleShowModal = (trip) => {
        setEditData({
            id: trip.id,
            start_date: trip.start_date,    
            end_date: trip.end_date, 
        });
        setShowModal(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditData(prevData => ({
             ...prevData, [name]: value 
            // return newData;
        }));
    };
    

    const handleSaveChanges = async () => {
        try {
            const response = await api.put(`trips/trip_management/${editData.id}/`, editData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            });
            console.log('Trip updated successfully', response.data);
            setShowModal(false);
            setTrips(trips.map(trip => trip.id === response.data.id ? response.data : trip));
    
        } 
        catch (error) {
            console.error('Trip update failed', error.response ? error.response.data : 'No response');
            alert('Failed to update trip: ' + JSON.stringify(error.response.data));
        }
    }


    const handleDeleteTrip = async (tripId) => {
        const confirmDelete = window.confirm('Are you sure you want to cancel this trip?');
        if (confirmDelete) {
            api.delete(`trips/trip_management/${tripId}/`, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            })
            .then(() => {
                // Update local state to reflect the deletion
                const updatedTrips = trips.filter(trip => trip.id !== tripId);
                setTrips(updatedTrips);
                alert('Trip cancelled successfully');
            })
            .catch((error) => {
                console.error('Failed to cancel trip', error.response ? error.response.data : 'No response');
                alert('Failed to cancel trip: ' + JSON.stringify(error.response.data));
            });
        }
    };


    const addToCart = async (tripId, tripPrice) => {
        try {
            const postData = {
                trip: tripId,
                trip_price: tripPrice,
            };
            const response = await api.post("/my_cart/cart/", postData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            });
            if (response.status === 201) {
                console.log('Trip added to cart successfully', response.data);
                alert('Trip added to cart successfully!');
            } else {
                console.error('Failed to add trip to cart', response.data);
                alert('Failed to add trip to cart');
            }
        } catch (error) {
            console.error('Failed to add trip to cart', error.response ? error.response.data : error.message);
            alert('Failed to add trip to cart. Check console for more information.');
        }
    };
    
    const isTripInCart = (tripId) => {
        return cartItems.some(item => item.trip === tripId);
    }



        return (
            <div>
                <h1>My Trips</h1>
                {trips.map(trip => (
                        <Card key={trip.id}>
                            <Card.Body>
                             <h2>{trip.bike.make} {trip.bike.model} </h2>
                             <h2>{trip.start_date} to {trip.end_date}</h2>
                            <p>Cost: {trip.total_cost}</p>
                            <Button onClick={()=>addToCart(trip.id, trip.total_cost)} disabled={isTripInCart(trip.id)}>Add To Cart</Button>
                            <Button onClick={() => handleShowModal(trip)}>Edit This Trip</Button>
                            <Button variant="danger" onClick={() => handleDeleteTrip(trip.id)}>Cancel Trip</Button>

                            </Card.Body>
                        </Card>
                    ))}

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header>
                            <Modal.Title>Edit Trip</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
        
                                    {/* <Form.Control type="hidden" name="bike_id" value={editData.bike} />
                                    <Form.Control type="hidden" name="user_id" value={editData.user} /> */}


                                {/* <Form.Group>
                                    <Form.Label>Make</Form.Label>
                                    <Form.Control type="text" name="make" value={editData.make} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Model</Form.Label>
                                    <Form.Control type="text" name="model" value={editData.model} onChange={handleChange} />
                                </Form.Group> */}
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        value={editData.start_date}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        value={editData.end_date}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                        </Modal.Footer>
                    </Modal>
            </div>
        );
    }

    export default TripsPage;
    