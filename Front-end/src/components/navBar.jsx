import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

const handleLogout = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const config = {
        headers: {
            'Authorization': `Token ${token}` // provide the necessary header information to Django
        }
    };

    try {
        await axios.post('http://localhost:8000/api/v1/user/logout/', null, config);
        localStorage.removeItem('token');  // Remove the token
        navigate('/');  // Redirect to the login page
    } catch (error) {
        console.error('Logout failed', error.response ? error.response.data : 'No response');
    }
    };

    return (
        <nav>
            <h1>Easy Rider</h1>
            <ul>
            <li><Link to="landing">Home</Link></li>
            <li><Link to="bikes">Bikes</Link></li>
            <li><Link to="about">About</Link></li>
            <li><Link to="cart">Cart</Link></li>
            <li><Link to="trips">Trips</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
            
        </nav>
    );
}

export default NavBar;