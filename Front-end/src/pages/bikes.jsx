import { useEffect, useState } from 'react';
import axios from 'axios';
import BikeCard from '../components/cards';
import imageMap from '../components/imageMap';



function BikesPage() {

    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/motorcycles/all_motorcycles/');
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

    return (
        <div>
            <h1>View Bikes on this page</h1>
            <div className="bikes-container">
                {bikes.map((bike) => (
                    <BikeCard key={bike.id} bike={bike} />
                ))}
        </div>
        </div>
    );
}

export default BikesPage;