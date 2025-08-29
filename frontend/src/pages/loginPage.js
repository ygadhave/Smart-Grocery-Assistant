// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const API_URL = process.env.REACT_APP_API_ENDPOINT;

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, { email, password });
//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       setMessage("Login successful!");
//       setTimeout(() => {
//         navigate('/home');
//       }, 1500);
//     } catch (error) {
//       console.error("Login error:", error);
//       setMessage("Invalid credentials or error during login");
//     }
//   };

//   const handleGuestAccess = async () => {
//     try {
//       const guestCredentials = {
//         email: "guest@smartgrocery.com",
//         password: "guest123" 
//       };

//       const response = await axios.post(`${API_URL}/auth/login`, guestCredentials);
//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       setMessage("Continuing as Guest...");
//       setTimeout(() => {
//         navigate("/home");
//       }, 1500);
//     } catch (error) {
//       console.error("Guest login error:", error);
//       setMessage("Error continuing as guest");
//     }
//   };

//   const handleSignupRedirect = () => {
//     navigate('/signup');
//   };

//   return (
//     <div style={{
//       display: 'flex', flexDirection: 'column', alignItems: 'center',
//       justifyContent: 'center', minHeight: '100vh',
//       background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
//       padding: '20px'
//     }}>
//       <div style={{
//         background: 'white', padding: '40px', borderRadius: '8px',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%'
//       }}>
//         <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Smart Grocery Assistant</h1>
//         <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             style={{
//               width: '100%', padding: '10px', marginBottom: '15px',
//               borderRadius: '4px', border: '1px solid #ccc'
//             }}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             style={{
//               width: '100%', padding: '10px', marginBottom: '20px',
//               borderRadius: '4px', border: '1px solid #ccc'
//             }}
//             required
//           />
//           <button type="submit" style={{
//             width: '100%', padding: '10px', background: '#fbc2eb',
//             color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
//             marginBottom: '10px'
//           }}>
//             Login
//           </button>
//         </form>

//         <p style={{ textAlign: 'center', margin: '10px 0' }}>or</p>

//         <button onClick={handleGuestAccess} style={{
//           width: '100%', padding: '10px', background: '#f6d365',
//           color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
//           marginBottom: '10px'
//         }}>
//           Continue as Guest
//         </button>

//         <button onClick={handleSignupRedirect} style={{
//           width: '100%', padding: '10px', background: '#fda085',
//           color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
//         }}>
//           Not a member? Sign Up
//         </button>

//         {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingBasket, LogIn, UserPlus, User } from "lucide-react";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/home");
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
        password: "guest123",
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
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform hover:scale-105 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <ShoppingBasket className="w-16 h-16 text-emerald-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Smart Grocery</h1>
          <p className="text-gray-600 mt-2">Your personal pantry assistant</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full p-2 border rounded"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 btn-primary bg-emerald-600 text-white rounded-lg px-4 py-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGuestAccess}
            className="w-full flex items-center justify-center space-x-2 btn-secondary bg-gray-200 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-300 transition-colors duration-200"
          >
            <User className="w-5 h-5" />
            <span>Continue as Guest</span>
          </button>

          <button
            onClick={handleSignupRedirect}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-100 text-emerald-700 rounded-lg px-4 py-2 hover:bg-emerald-200 transition-colors duration-200"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
