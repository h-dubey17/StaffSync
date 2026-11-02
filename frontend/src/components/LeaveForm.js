import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaveForm({ user }) {
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: ''
  });
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all leaves to display
  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/all');
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/leave/apply', {
        userId: user._id,
        userName: user.name,
        ...formData
      });
      setMessage(res.data.message);
      setFormData({ reason: '', startDate: '', endDate: '' });
      fetchLeaves();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit leave');
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
      <h3>Leave Management</h3>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Reason:</label><br />
          <input type="text" name="reason" value={formData.reason} onChange={handleChange} required style={{ width: '100%', padding: '6px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Start Date:</label><br />
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={{ width: '100%', padding: '6px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>End Date:</label><br />
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required style={{ width: '100%', padding: '6px' }} />
          </div>
        </div>
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply for Leave</button>
      </form>

      <h4>Leave Requests History</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {leaves.map((leave) => (
          <li key={leave._id} style={{ background: 'white', padding: '10px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <strong>{leave.userName}</strong>: {leave.reason} ({leave.startDate?.slice(0, 10)} to {leave.endDate?.slice(0, 10)}) - <span style={{ color: leave.status === 'Pending' ? 'orange' : 'green' }}>{leave.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}