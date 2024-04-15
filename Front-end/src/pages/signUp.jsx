import { useState } from "react";
import axios from "axios";

function SignupPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
      });
    
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
        event.preventDefault();  // Prevent the default form submission behavior
    
        try {
          // Send a POST request to the backend
          const response = await axios.post('http://localhost:8000/api/v1/user/signup/', formData);
          console.log('Signup successful', response.data);
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
