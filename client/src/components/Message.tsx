import React from 'react';
import Markdown from 'react-markdown';

type Role = "assistant" | "user";

type Message = {
  role: Role;
  content: string;
};

type MessageProps = {
  message: Message;
};

export default function MessageTag(props: MessageProps) {
  return (
    <div className={`message ${props.message.role}`}>
      {
        props.message.role === "user"
          ? (
            <div className="text">{props.message.content}</div>
          ) : (
            <Markdown>{props.message.content}</Markdown>
          )
      }
    </div>
  );
}
