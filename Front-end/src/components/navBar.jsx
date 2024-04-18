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
        localStorage.removeItem('user');  // Remove the user data
        navigate('/');  // Redirect to the login page
    } catch (error) {
        console.error('Logout failed', error.response ? error.response.data : 'No response');
    }
    };

    return (
      <Navbar expand="lg" bg="light" fixed="top">
          <Container fluid>
              <Navbar.Brand href="about">Easy Rider</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                      <Nav.Link href="bikes" className="me-3">Bikes</Nav.Link>
                      <Nav.Link href="trips" className="me-3">Trips</Nav.Link>
                      <Nav.Link href="cart" className="me-3">Cart</Nav.Link>
                  </Nav>
                  <Nav className="ms-auto">
                      <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
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