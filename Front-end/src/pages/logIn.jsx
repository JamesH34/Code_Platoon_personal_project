import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  
  const[credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prevState => ({
        ...prevState,
        [name]: value

    }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/v1/user/login/', credentials);
            console.log('Login successful', response.data);
            localStorage.setItem('token', response.data.token);  // Store the token
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
