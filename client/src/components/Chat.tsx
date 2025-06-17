import React, { useState } from 'react';

function Chat() {

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  function handleUpdateInputText(event) {
    if (event?.target?.value) {
      setInputText(event.target.value);
    }
  }

  function handleInputKeyDown(event) {
    if (event.keyCode === 13) {
      handleSubmit();
      event.stopPropagation();
    }
  }

  function handleSubmit() {
    setTimeout(() => {
      setMessages([...messages, inputText.trim()]);
      setInputText('');
    });
  }

  return (
    <div>
      <div
        className="messages"
      >
        {
          messages.map((message, idx) => (<div key={idx}>{message}</div>))
        }
      </div>
      <textarea
        value={inputText}
        onChange={handleUpdateInputText}
        onKeyDown={handleInputKeyDown}
      />
      <button
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default Chat;
