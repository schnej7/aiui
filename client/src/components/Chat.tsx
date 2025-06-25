import { loadEnv } from 'vite';
import React, { useEffect, useState } from 'react';
import MessageTag from './Message';

type Role = "assistant" | "user";

type Message = {
  content: string;
  role: Role;
};

function Chat() {
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeResponse, setActiveResponse] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [activeResponse])

  useEffect(() => {
    if (!isStreamingResponse && activeResponse !== "") {
      setMessages([...messages, {
        content: activeResponse,
        role: "assistant",
      }]);
      setActiveResponse("");
    }
  }, [messages, isStreamingResponse, activeResponse]);

  useEffect(() => {
    async function sendPrompt() {
      setIsStreamingResponse(true);
      const BASE_URL = process.env.VITE_BASE_URL;
      const LLM_PORT = process.env.VITE_LLM_PORT;

      const response = await fetch(`http://${BASE_URL}:${LLM_PORT}/api/chat`, {
        method: 'POST',
        body: JSON.stringify({
          model: "llama3.1",
          messages,
        }),
      });

      const decoder = new TextDecoder('utf-8');
      if (response && response.body) {
        let newMessage = "";
        for await (const chunk of response.body) {
          const decodedChunk = decoder.decode(chunk);
          const jsonChunk = JSON.parse(decodedChunk);

          newMessage = `${newMessage}${jsonChunk.message.content}`;
          setActiveResponse(newMessage);
        }
        setIsStreamingResponse(false);
      }
    }

    const lastMessage = messages[messages.length - 1];
    console.log(messages, lastMessage);
    if (lastMessage && lastMessage.role === "user") {
      console.log("callSendPrompt");
      sendPrompt();
    }

    scrollToBottom();
    return () => {
      console.log('cleanup');
    }
  }, [messages]);

  function scrollToBottom() {
    var messagesEl = document.getElementById("MESSAGES");
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function handleUpdateInputText(event) {
    if (event?.target?.value) {
      setInputText(event.target.value);
    }
  }

  function handleInputKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      handleSubmit();
      event.stopPropagation();
    }
  }

  function handleSubmit() {
    const sanitizedInputText = inputText.trim();
    if (!isStreamingResponse) {
      setMessages([...messages, {
        content: `${sanitizedInputText}`,
        role: "user",
      }]);
      setInputText('');
    }
  }

  async function handleNewAI() {
    const response = await fetch(`/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aiModel: "llama3.1",
        context: "You are my best friend.",
      }),
    });
  }

  return (
    <div className="chat">
      <div
        id="MESSAGES"
        className="messages"
      >
        {
          messages.map((message, idx) => (
            <MessageTag key={idx} message={message} />
          ))
        }
        <MessageTag message={{ content: activeResponse, role: "assistant" }} />
      </div>
      <div className="input-bar">
        <textarea
          className="text-area"
          value={inputText}
          onChange={handleUpdateInputText}
          onKeyDown={handleInputKeyDown}
        />
        <button
          onClick={handleNewAI}
        >
          New AI
        </button>
      </div>
    </div>
  );
}

export default Chat;
