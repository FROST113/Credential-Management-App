import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });

      toast.success('Registration successful.');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
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

        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Register;