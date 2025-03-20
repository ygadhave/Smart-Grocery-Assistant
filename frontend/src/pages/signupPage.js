import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/signup`, { username, email, password });
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500); 
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Error during signup");
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%', padding: '10px', marginBottom: '15px',
              borderRadius: '4px', border: '1px solid #ccc'
            }}
            required
          />
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
            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}>
            Sign Up
          </button>
        </form>
        {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
