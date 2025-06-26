import React, { useState, useEffect } from 'react';

import Chat from './components/Chat';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Button from './components/generic/Button';
import AlignedRow from './components/generic/AlignedRow';

import type { AI, AIs, NewAI } from './types/AI';
import type { User } from './types/User';

import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [AIs, setAIs] = useState<AIs>([]);
  const [showSignup, setShowSignup] = useState(false);

  function clearUserData() {
    setUser(null);
    setAIs([]);
  }

  function setUserData(userData: unknown) {
    if (userData && typeof userData === "object") {
      if (
        "user" in userData
        && userData.user
        && typeof userData.user === "object"
        && "name" in userData.user
        && userData.user.name
        && typeof userData.user.name === "string"
        && "username" in userData.user
        && userData.user.username
        && typeof userData.user.username === "string"
      ) {
        setUser({
          name: userData.user.name,
          username: userData.user.username,
        });
      } else {
        console.error('malformed user', userData);
      }

      if (
        "ais" in userData
        && userData.ais
        && Array.isArray(userData.ais)
      ) {
        const ais: AIs = [];
        for (const ai of userData.ais) {
          if (
            ai
            && typeof ai === "object"
            && "name" in ai
            && typeof ai.name === "string"
            && "aiModel" in ai
            && typeof ai.aiModel === "string"
            && "context" in ai
            && typeof ai.context === "string"
          ) {
            ais.push({
              _id: ai._id,
              name: ai.name,
              aiModel: ai.aiModel,
              context: ai.context,
            });
          } else {
            console.error('malformed ai', ai);
          }
        }
        setAIs(ais);
      } else {
        console.error('malformed ais', userData);
      }
    }
  }

  // Check if user is logged in when app loads
  useEffect(() => {
    updateUserData();
  }, []);

  async function updateUserData() {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const userData = await res.json();
        console.log(userData);
        setUserData(userData);
      } else {
        clearUserData();
      }
    } catch {
      clearUserData();
    }
  }

  async function handleLoginSignupSuccess() {
    // Refetch user info after login/signup
    const res = await fetch('/api/user');
    if (res.ok) {
      const userData = await res.json();
      setUserData(userData);
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    clearUserData();
  }

  async function createNewAI(ai: NewAI) {
    const response = await fetch(`/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ai),
    });
    await updateUserData();
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
      <Chat
        AIs={AIs}
        createNewAI={createNewAI}
      />
    </div>
  );
}

export default App;
