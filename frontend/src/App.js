import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    
    try {
      const response = await axios.post(endpoint, {
        name: isLogin ? undefined : name,
        email,
        password
      });
      setMessage(isLogin ? 'Login Successful!' : 'Registration Successful! Please login.');
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>StaffSync</h1>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
        {!isLogin && (
          <div style={{ marginBottom: '10px' }}>
            <label>Name: </label><br />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '5px', width: '250px' }} />
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '5px', width: '250px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password: </label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '5px', width: '250px' }} />
        </div>
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
      {message && <p style={{ fontWeight: 'bold', color: message.includes('Successful') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default App;