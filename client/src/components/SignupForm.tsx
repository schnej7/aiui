import React, { FormEvent, useState } from 'react';

import Button from './generic/Button';
import Input from './generic/Input';

type SignupFormProps = {
  onSignupSuccess: () => void;
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name }),
      });
      if (res.ok) {
        onSignupSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Signup failed');
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
      <h2>Sign Up</h2>
      <Input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
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
      <Button type="submit">Sign Up</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
