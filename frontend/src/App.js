import React, { useState } from 'react';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <div>
      {!isLoggedIn ? (
        <Register />
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Welcome to StaffSync Dashboard, {user?.name}</h1>
          <p>Role: {user?.role}</p>
        </div>
      )}
    </div>
  );
}

export default App;