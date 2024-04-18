import { useEffect, useState } from 'react';

import BikeCard from '../components/cards';
import imageMap from '../components/imageMap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../utilities';



function BikesPage() {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [bikes, setBikes] = useState([]);
    const [selectedBike, setSelectedBike] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date())
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await api.get('motorcycles/all_motorcycles/');
                const bikesWithImages = response.data.map(bike => ({
                    ...bike,
                    imageUrl: imageMap[bike.model] || '/images/Rebel.jpg' 
                }));
                console.log(bikesWithImages);
                setBikes(bikesWithImages);
            } catch (error) {
                console.error('Bike fetch failed', error.response ? error.response.data : 'No response');
            }
        };


        fetchBikes();
    }, []);


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedBike) {
            alert('Please select a bike.');
            return;
        }
        if (!currentUser || !currentUser.id) {
            alert('User not logged in or user ID not available.');
            return;
        }
    
        const tripData = {
            bike_id: selectedBike,
            user: currentUser.id,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
        };
    
        setSubmitting(true);
        try {
            const response = await api.post('trips/create/', tripData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` }
            });
            alert('Trip created successfully');
            console.log('Trip response:', response.data);
        } catch (error) {
            console.error('Trip creation failed', error.response ? error.response.data : 'No response');
            alert('Failed to create trip. Check console for more information.');
        } finally {
            setSubmitting(false);
        }
    };
    

        return (
            <div style= {{ paddingTop: '70px' }}>
                <h1>View Our Selection</h1>
                <form onSubmit={handleSubmit} style={{ margin: '20px' }}>
                    <div>
                        <label>Select Bike:</label>
                        <select value={selectedBike} onChange={e => setSelectedBike(e.target.value)}>
                            <option value="">Select a bike...</option>
                            {bikes.map(bike => (
                                <option key={bike.id} value={bike.id}>
                                    {bike.make} {bike.model}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Start Date:</label>
                        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                    </div>
                    <div>
                        <label>End Date:</label>
                        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                    </div>
                    <button type="submit" disabled={submitting}>Create Trip</button>
                </form>
                <div className="bikes-container">
                    {bikes.map(bike => (
                        <BikeCard key={bike.id} bike={bike} />
                    ))}
                </div>
            </div>
        );
    }
    
    export default BikesPage;