import React from 'react';

import { User } from '../types/User';

import AlignedRow from './generic/AlignedRow';
import Button from './generic/Button';

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
    <AlignedRow justifyContent="end">
      <AlignedRow>
        <div>Logged in as <b>{props.user.name}</b> (<i>{props.user.username}</i>)</div>
        <Button onClick={props.handleLogout}>Log out</Button>
      </AlignedRow>
    </AlignedRow>
  );
}
