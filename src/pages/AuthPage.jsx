import React, { useState } from 'react';
import { Tab, Tabs, Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [key, setKey] = useState('login');

  const { login, user, logout } = useAuth();

  // State for Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State for Register Form
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/api/auth/login", { email: loginEmail, password: loginPassword });
        if (response.status === 200) {
          login(response.data.token);
        } else {
          console.error(response.status);
        }
    } catch (error) {
        console.error(error.response.data.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
   try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { email: registerEmail, password: registerPassword });
      if (response.status === 200) {
        login(response.data.token);
      } else {
        console.error(response.status);
      }
    } catch (err) {
      // setError('Error: ' + err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="shadow p-4 rounded bg-white">
            <h2 className="text-center mb-4">Welcome!</h2>
            <Tabs
              id="auth-tabs"
              className="mb-3"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              justify
            >
              {/* Login Tab */}
              <Tab eventKey="login" title="Login">
                <Form onSubmit={handleLoginSubmit}>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
              </Tab>

              {/* Register Tab */}
              <Tab eventKey="register" title="Register">
                <Form onSubmit={handleRegisterSubmit}>
                  <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="registerPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" className="w-100">
                    Register
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
