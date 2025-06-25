import React from 'react';

import { User } from '../types/User';

type HeaderProps = {
  handleLogout: () => void;
  user?: User;
};

export default function Header(props: HeaderProps) {
  if (!props.user) {
    return (
      <div>ChatSCH</div>
    );
  }

  return (
    <div>
      <div>Logged in as <b>{props.user.name}</b> (<i>{props.user.username}</i>)</div>
      <button onClick={props.handleLogout}>Log out</button>
    </div>
  );
}
