import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  
  const[credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevState => ({
        ...prevState,
        [name]: value

    }));
    };




    const fetchUserDetails = async (token) => {
      try {
          const response = await axios.get('http://localhost:8000/api/v1/user/userinfo/', {
              headers: { Authorization: `Token ${token}` }
          });
          setCurrentUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in localStorage
          navigate('/landing');  // Redirect to the landing page
      } catch (error) {
          console.error('Failed to fetch user details', error.response ? error.response.data : 'No response');
      }
  };



//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//         const response = await axios.post('http://localhost:8000/api/v1/user/login/', credentials);
//         console.log('Login successful', response.data);
//         localStorage.setItem('token', response.data.token);  // Store the token
//         const userResponse = await axios.get('http://localhost:8000/api/v1/user/userinfo/', {
//             headers: { 'Authorization': `Token ${response.data.token}` }
//         });
//         localStorage.setItem('user', JSON.stringify(userResponse.data)); // Store user data
//         navigate('/landing');  // Redirect to the landing page
//     } catch (error) {
//         console.error('Login failed', error.response ? error.response.data : 'No response');
//     }
// };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/v1/user/login/', credentials);
            console.log('Login successful', response.data);
            localStorage.setItem('token', response.data.token);  // Store the token
            fetchUserDetails(response.data.token);
            navigate('/landing');  // Redirect to the landing page
        } catch (error) {
            console.error('Login failed', error.response ? error.response.data : 'No response');
        }
        };
  
    return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleInputChange} />
        <input type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
