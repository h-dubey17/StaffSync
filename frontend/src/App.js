import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register switchToLogin={() => setShowLogin(true)} />
        )
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Welcome to StaffSync Dashboard, {user?.name}</h1>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;