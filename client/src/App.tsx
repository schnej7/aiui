import React, { useState, useEffect } from 'react';

import Chat from './components/Chat';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

import './App.css';

type User = {
  name: string;
  username: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  // Check if user is logged in when app loads
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  async function handleLoginSignupSuccess() {
    // Refetch user info after login/signup
    const res = await fetch('/api/user');
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  }

  if (!user) {
    return (
      <div>
        {showSignup ? (
          <>
            <SignupForm onSignupSuccess={handleLoginSignupSuccess} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setShowSignup(false)}>Log In</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onLoginSuccess={handleLoginSignupSuccess} />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setShowSignup(true)}>Sign Up</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <p>
        Logged in as <b>{user.name}</b> (<i>{user.username}</i>) &nbsp;
        <button onClick={handleLogout}>Log out</button>
      </p>
      <Chat />
    </div>
  );
}

export default App;
