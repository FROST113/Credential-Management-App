import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = async () => {
    try {
      // Make a POST request to the login endpoint
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      // Extract the token from the response
      const { token, userData } = response.data;
      console.log(response.data);

      // Store the token in localStorage
      localStorage.setItem('Bearer', token);

        // Set the user data in state
      setUserData(userData);

      // Display success toast
      toast.success('Login successful.');
      navigate('/UserDashboard');
    } catch (error) {
      // Display error toast
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <Form>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
        <p>
        Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Login;
