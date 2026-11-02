import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'register'

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('landing');
  };

  if (isLoggedIn && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#090d16', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>HRM Portal</h2>
        <div>
          <button onClick={() => setCurrentView('login')} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}>Login</button>
          <button onClick={() => setCurrentView('register')} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Register</button>
        </div>
      </div>

      {/* Main View Selection */}
      {currentView === 'landing' && (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#f8fafc' }}>Empower Your Workforce with HRM Portal</h1>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '20px auto' }}>
            A modern Human Resource Management platform designed to simplify attendance tracking, leave management, employee records, and communication across teams.
          </p>
          <button onClick={() => setCurrentView('register')} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>Get Started</button>
        </div>
      )}

      {currentView === 'login' && (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
          <Login onLoginSuccess={handleLoginSuccess} switchToRegister={() => setCurrentView('register')} />
        </div>
      )}

      {currentView === 'register' && (
        <div style={{ maxWidth: '400px', margin: '40px auto' }}>
          <Register switchToLogin={() => setCurrentView('login')} />
        </div>
      )}
    </div>
  );
}

export default App;