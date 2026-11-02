import React, { useState } from 'react';
import axios from 'axios';

export default function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(res.data.message || 'Registration successful! You can now log in.');
      setTimeout(() => {
        switchToLogin();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check server connection.');
    }
  };

  return (
    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '8px', color: '#fff' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>HRM Portal Register</h3>
      
      {message && <p style={{ background: '#166534', color: '#bbf7d0', padding: '10px', borderRadius: '4px' }}>{message}</p>}
      {error && <p style={{ background: '#991b1b', color: '#fecaca', padding: '10px', borderRadius: '4px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Enter your name" 
            style={{ width: '95%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="Enter your email" 
            style={{ width: '95%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="Enter password" 
            style={{ width: '95%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
          >
            <option value="Employee">Employee</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Register
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
        Already have an account? <span onClick={switchToLogin} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>Login</span>
      </p>
    </div>
  );
}