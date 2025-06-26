import React, { useState, useEffect } from 'react';

import Chat from './components/Chat';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Button from './components/generic/Button';
import AlignedRow from './components/generic/AlignedRow';

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
          console.log(userData);
          setUser(userData.user);
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
      setUser(userData.user);
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  }

  if (!user) {
    return (
      <div
        className="m-auto flex max-w-sm mt-6 p-9 flex-col rounded overflow-hidden shadow-lg"
      >
        {showSignup ? (
          <>
            <SignupForm onSignupSuccess={handleLoginSignupSuccess} />
            <AlignedRow>
              Already have an account?{' '}
              <Button onClick={() => setShowSignup(false)}>Log In</Button>
            </AlignedRow>
          </>
        ) : (
          <>
            <LoginForm onLoginSuccess={handleLoginSignupSuccess} />
            <AlignedRow>
              Don't have an account?{' '}
              <Button onClick={() => setShowSignup(true)}>Sign Up</Button>
            </AlignedRow>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <Header
        user={user}
        handleLogout={handleLogout}
      />
      <Chat />
    </div>
  );
}

export default App;
