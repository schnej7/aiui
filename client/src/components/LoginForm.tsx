import React, { FormEvent, useEffect, useState } from 'react';

import Button from './generic/Button';
import Input from './generic/Input';

type LoginFormProps = {
  onLoginSuccess: () => void,
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        onLoginSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    }
  }

  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit}
    >
      <h2>Login</h2>
      <Input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Log In</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
