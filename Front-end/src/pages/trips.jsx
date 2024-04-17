import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function TripsPage() {
    const [trips, setTrips] = useState([]);
    

    useEffect(() => {
        const fetchTrips = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/v1/trips/create/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` }
                });
                setTrips(response.data);
            } catch (error) {
                console.error('Failed to fetch trips', error);
            }   
        };
        fetchTrips();
    }, []);

        return (
            <div>
                <h1>My Trips</h1>
                {trips.map(trip => (
                        <Card key={trip.id}>
                            <Card.Body>
                             <h2>{trip.bike.make} {trip.bike.model} </h2>
                             <h2>{trip.start_date} to {trip.end_date}</h2>
                            <p>Cost: {trip.total_cost}</p>
                            <Button>Add To Cart</Button>
                            <Button>Edit This Trip</Button><Button variant="danger">Cancel Trip</Button>

                            </Card.Body>
                        </Card>
                    ))}
            </div>
        );
    }
    
    export default TripsPage;
    