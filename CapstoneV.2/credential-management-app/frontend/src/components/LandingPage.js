import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Welcome to the Credential Management App</h2>
          <Button variant="primary" href="/register">
            Register
          </Button>{' '}
          <Button variant="primary" href="/login">
            Login
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LandingPage;