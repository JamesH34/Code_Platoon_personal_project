import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from '../../utilities';

function SignupPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
      });
    const navigate = useNavigate();

      // Update state on input change
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
      // Handle form submission
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          const response = await api.post('user/signup/', formData);
          console.log('Signup successful', response.data);
          localStorage.setItem('token', response.data.token);  // Store the token
          navigate('/login');  // Redirect to the login page
        } catch (error) {
          console.error('Signup failed', error.response ? error.response.data : 'No response');
        }
      };






      return (
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      );
    }
    
    export default SignupPage;
