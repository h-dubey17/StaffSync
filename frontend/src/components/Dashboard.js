import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('announcements');
  const [leaves, setLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [trainings, setTrainings] = useState([]);
  
  // Forms state
  const [leaveData, setLeaveData] = useState({ reason: '', startDate: '', endDate: '' });
  const [noticeData, setNoticeData] = useState({ title: '', message: '' });
  const [trainingData, setTrainingData] = useState({ title: '', description: '', trainerName: '', assignedTo: '' });
  const [msg, setMsg] = useState('');

  const loadData = async () => {
    try {
      const [lRes, aRes, attRes, tRes] = await Promise.all([
        axios.get('http://localhost:5000/api/leave/all'),
        axios.get('http://localhost:5000/api/announcements/all'),
        axios.get('http://localhost:5000/api/attendance/all'),
        axios.get('http://localhost:5000/api/training/all')
      ]);
      setLeaves(lRes.data);
      setAnnouncements(aRes.data);
      setAttendance(attRes.data);
      setTrainings(tRes.data);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/leave/apply', { userId: user._id, userName: user.name, ...leaveData });
    setMsg('Leave submitted successfully!');
    setLeaveData({ reason: '', startDate: '', endDate: '' });
    loadData();
  };

  const handleStatusUpdate = async (id, status) => {
    await axios.put(`http://localhost:5000/api/leave/update-status/${id}`, { status });
    loadData();
  };

  const handleCheckIn = async () => {
    await axios.post('http://localhost:5000/api/attendance/checkin', { userId: user._id, userName: user.name });
    setMsg('Marked attendance successfully!');
    loadData();
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/announcements/create', noticeData);
    setMsg('Announcement posted!');
    setNoticeData({ title: '', message: '' });
    loadData();
  };

  const handleTrainingSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/training/create', trainingData);
    setMsg('Training session created!');
    setTrainingData({ title: '', description: '', trainerName: '', assignedTo: '' });
    loadData();
  };

  const navStyle = (tab) => ({
    padding: '10px 18px',
    cursor: 'pointer',
    background: activeTab === tab ? '#007bff' : '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold'
  });

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
        <h2>HRM Portal ({user.role} View)</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Logged in as: <strong>{user.name}</strong> ({user.role})</span>
          <button onClick={onLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      {msg && <p style={{ background: '#166534', color: '#bbf7d0', padding: '10px', borderRadius: '4px', marginTop: '15px' }}>{msg}</p>}

      {/* Dynamic Tab Navigation depending on Role */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button style={navStyle('announcements')} onClick={() => setActiveTab('announcements')}>Announcements</button>
        <button style={navStyle('leaves')} onClick={() => setActiveTab('leaves')}>Leaves</button>
        <button style={navStyle('attendance')} onClick={() => setActiveTab('attendance')}>Attendance</button>
        <button style={navStyle('profile')} onClick={() => setActiveTab('profile')}>Profile</button>
        
        {(user.role === 'HR' || user.role === 'Manager') && (
          <>
            <button style={navStyle('employee_mgmt')} onClick={() => setActiveTab('employee_mgmt')}>Employee Management</button>
            <button style={navStyle('training')} onClick={() => setActiveTab('training')}>Training & Development</button>
          </>
        )}
      </div>

      {/* Main Tab Contents */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        
        {/* Tab 1: Announcements */}
        {activeTab === 'announcements' && (
          <div>
            <h3>Company Announcements</h3>
            {(user.role === 'HR' || user.role === 'Manager') && (
              <form onSubmit={handleNoticeSubmit} style={{ marginBottom: '20px', background: '#334155', padding: '15px', borderRadius: '6px' }}>
                <h4>Create Announcement</h4>
                <input type="text" placeholder="Title" value={noticeData.title} onChange={e => setNoticeData({...noticeData, title: e.target.value})} required style={{ display: 'block', width: '95%', marginBottom: '10px', padding: '8px' }} />
                <textarea placeholder="Message content" value={noticeData.message} onChange={e => setNoticeData({...noticeData, message: e.target.value})} required style={{ display: 'block', width: '95%', marginBottom: '10px', padding: '8px' }} />
                <button type="submit" style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Post Notice</button>
              </form>
            )}
            {announcements.map(item => (
              <div key={item._id} style={{ background: '#334155', padding: '12px', marginBottom: '10px', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#60a5fa' }}>{item.title}</h4>
                <p style={{ margin: 0 }}>{item.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Leaves (Submissions & Review) */}
        {activeTab === 'leaves' && (
          <div>
            <h3>Leave Management</h3>
            {user.role === 'Employee' ? (
              <div>
                <form onSubmit={handleLeaveSubmit} style={{ background: '#334155', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                  <h4>Apply for Leave</h4>
                  <input type="text" placeholder="Reason" value={leaveData.reason} onChange={e => setLeaveData({...leaveData, reason: e.target.value})} required style={{ width: '95%', padding: '8px', marginBottom: '10px' }} />
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="date" value={leaveData.startDate} onChange={e => setLeaveData({...leaveData, startDate: e.target.value})} required style={{ padding: '8px', flex: 1 }} />
                    <input type="date" value={leaveData.endDate} onChange={e => setLeaveData({...leaveData, endDate: e.target.value})} required style={{ padding: '8px', flex: 1 }} />
                  </div>
                  <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Submit Request</button>
                </form>
                <h4>My Leave Requests</h4>
                {leaves.filter(l => l.userName === user.name).map(l => (
                  <div key={l._id} style={{ background: '#334155', padding: '10px', marginBottom: '8px', borderRadius: '4px' }}>
                    <p style={{ margin: 0 }}><strong>{l.reason}</strong> ({l.startDate?.slice(0, 10)} to {l.endDate?.slice(0, 10)}) - Status: <span style={{ color: l.status === 'Approved' ? '#4ade80' : l.status === 'Rejected' ? '#f87171' : '#facc15' }}>{l.status}</span></p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h4>Manage Leave Applications (HR / Manager Review)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#334155' }}>
                      <th style={{ padding: '10px' }}>Applicant</th>
                      <th style={{ padding: '10px' }}>Reason</th>
                      <th style={{ padding: '10px' }}>Dates</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map(l => (
                      <tr key={l._id} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '10px' }}>{l.userName}</td>
                        <td style={{ padding: '10px' }}>{l.reason}</td>
                        <td style={{ padding: '10px' }}>{l.startDate?.slice(0, 10)} to {l.endDate?.slice(0, 10)}</td>
                        <td style={{ padding: '10px' }}>{l.status}</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleStatusUpdate(l._id, 'Approved')} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '6px', cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handleStatusUpdate(l._id, 'Rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <div>
            <h3>Attendance Records</h3>
            {user.role === 'Employee' && (
              <button onClick={handleCheckIn} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}>
                Check-in / Mark Attendance
              </button>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#334155' }}>
                  <th style={{ padding: '10px' }}>Employee</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Check In</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a._id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '10px' }}>{a.userName}</td>
                    <td style={{ padding: '10px' }}>{a.date?.slice(0, 10)}</td>
                    <td style={{ padding: '10px' }}>{a.checkIn}</td>
                    <td style={{ padding: '10px', color: '#4ade80' }}>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <div>
            <h3>Employee Profile</h3>
            <div style={{ background: '#334155', padding: '20px', borderRadius: '6px', maxWidth: '400px' }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
          </div>
        )}

        {/* Tab 5: Training & Development */}
        {activeTab === 'training' && (
          <div>
            <h3>Training & Development System</h3>
            {(user.role === 'HR' || user.role === 'Manager') && (
              <form onSubmit={handleTrainingSubmit} style={{ background: '#334155', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                <h4>Create Training Program</h4>
                <input type="text" placeholder="Training Title" value={trainingData.title} onChange={e => setTrainingData({...trainingData, title: e.target.value})} required style={{ display: 'block', width: '95%', marginBottom: '10px', padding: '8px' }} />
                <textarea placeholder="Description" value={trainingData.description} onChange={e => setTrainingData({...trainingData, description: e.target.value})} required style={{ display: 'block', width: '95%', marginBottom: '10px', padding: '8px' }} />
                <input type="text" placeholder="Trainer Name" value={trainingData.trainerName} onChange={e => setTrainingData({...trainingData, trainerName: e.target.value})} required style={{ width: '95%', marginBottom: '10px', padding: '8px' }} />
                <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Create Training</button>
              </form>
            )}
            {trainings.map(t => (
              <div key={t._id} style={{ background: '#334155', padding: '12px', marginBottom: '10px', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#38bdf8' }}>{t.title}</h4>
                <p style={{ margin: '0 0 5px 0' }}>{t.description}</p>
                <small>Trainer: <strong>{t.trainerName}</strong></small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}