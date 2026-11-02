import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import LeaveForm from './components/LeaveForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      {!isLoggedIn ? (
        showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register switchToLogin={() => setShowLogin(true)} />
        )
      ) : (
        <div style={{ padding: '20px', textAlign: 'left' }}>
          <h2>Welcome to StaffSync Dashboard, {user?.name}</h2>
          <p><strong>Email:</strong> {user?.email} | <strong>Role:</strong> {user?.role}</p>
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>Logout</button>
          
          {/* Render Leave Management Workflow */}
          <LeaveForm user={user} />
        </div>
      )}
    </div>
  );
}

export default App;