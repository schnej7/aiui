import React, { useEffect, useState } from 'react';

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
    if (!isStreamingResponse) {
      setMessages([...messages, {
        content: activeResponse,
        role: "assistant",
      }]);
      setActiveResponse("");
    }
  }, [isStreamingResponse, activeResponse]);

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
    const sanitizedInputText = inputText.trim();
    setMessages([...messages, {
      content: `${sanitizedInputText}`,
      role: "user",
    }]);
    console.log("c", messages);
    sendPrompt(sanitizedInputText);
    setInputText('');
  }

  async function sendPrompt(prompt) {
    if (isStreamingResponse) return;

    setIsStreamingResponse(true);
    console.log(prompt);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const LLM_PORT = process.env.REACT_APP_LLM_PORT;

    const response = await fetch(`http://${BASE_URL}:${LLM_PORT}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({
        model: "llama3.1",
        messages,
      }),
    });

    console.log(response);

    const decoder = new TextDecoder('utf-8');
    if (response && response.body) {
      let newMessage = "";
      for await (const chunk of response.body) {
        console.log("d", messages);
        const decodedChunk = decoder.decode(chunk);
        const jsonChunk = JSON.parse(decodedChunk);

        newMessage = `${newMessage}${jsonChunk.message.content}`;
        setActiveResponse(newMessage);
        console.log(jsonChunk);
      }
    }

    setIsStreamingResponse(false);
  }

  return (
    <div>
      <div
        className="messages"
      >
        {
          messages.map((message, idx) => (<div key={idx}>{message.content}</div>))
        }
        <div>{activeResponse}</div>
      </div>
      <textarea
        value={inputText}
        onChange={handleUpdateInputText}
        onKeyDown={handleInputKeyDown}
        disabled={isStreamingResponse}
      />
      <button
        onClick={handleSubmit}
        disabled={isStreamingResponse}
      >
        Submit
      </button>
    </div>
  );
}

export default Chat;
