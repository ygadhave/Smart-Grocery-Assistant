import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setMessage("Login successful!");
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Invalid credentials or error during login");
    }
  };

  const handleGuestAccess = async () => {
    try {
      const guestCredentials = {
        email: "guest@smartgrocery.com",
        password: "guest123" 
      };

      const response = await axios.post(`${API_URL}/auth/login`, guestCredentials);
      const { token } = response.data;
      localStorage.setItem("token", token);
      setMessage("Continuing as Guest...");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Guest login error:", error);
      setMessage("Error continuing as guest");
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Smart Grocery Assistant</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '10px', marginBottom: '15px',
              borderRadius: '4px', border: '1px solid #ccc'
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '10px', marginBottom: '20px',
              borderRadius: '4px', border: '1px solid #ccc'
            }}
            required
          />
          <button type="submit" style={{
            width: '100%', padding: '10px', background: '#fbc2eb',
            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
            marginBottom: '10px'
          }}>
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', margin: '10px 0' }}>or</p>

        <button onClick={handleGuestAccess} style={{
          width: '100%', padding: '10px', background: '#f6d365',
          color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
          marginBottom: '10px'
        }}>
          Continue as Guest
        </button>

        <button onClick={handleSignupRedirect} style={{
          width: '100%', padding: '10px', background: '#fda085',
          color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
        }}>
          Not a member? Sign Up
        </button>

        {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
