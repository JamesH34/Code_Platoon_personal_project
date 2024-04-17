import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import api from '../../utilities';



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
        await api.post('user/logout/', null, config);
        localStorage.removeItem('token');  // Remove the token
        navigate('/');  // Redirect to the login page
    } catch (error) {
        console.error('Logout failed', error.response ? error.response.data : 'No response');
    }
    };

    return (
        
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="about">Easy Rider</Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="bikes">Bikes </Nav.Link>
            <Nav.Link href="trips">Trips </Nav.Link>
             <Nav.Link href="cart">Cart </Nav.Link>
             <Button onClick={handleLogout}>Logout</Button>
             
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;




{/* <nav>
<h1>Easy Rider</h1>
<ul>
<li><Link to="landing">Home</Link></li>
<li><Link to="bikes">Bikes</Link></li>
<li><Link to="about">About</Link></li>
<li><Link to="cart">Cart</Link></li>
<li><Link to="trips">Trips</Link></li>
<li><button onClick={handleLogout}>Logout</button></li>
</ul>

</nav> */}