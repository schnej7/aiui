import { loadEnv } from 'vite';
import React, { useEffect, useState } from 'react';

import EditAIDialog from './EditAIDialog';
import MessageTag from './Message';
import Button from './generic/Button';
import Select from './generic/Select';
import TextArea from './generic/TextArea';
import AlignedRow from './generic/AlignedRow';

import type { AI, AIs, NewAI } from '../types/AI';

type Role = "assistant" | "user";

type Message = {
  content: string;
  role: Role;
};

type ChatProps = {
  AIs: AIs;
  createNewAI: (ai: NewAI) => void;
  updateAI: (ai: AI) => void;
  deleteAI: (aiId: AI["_id"]) => void;
}

const dummyAI = {
  aiModel: 'llama3.1',
  context: 'You are my best friend ever.',
}

function Chat(props: ChatProps) {
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeResponse, setActiveResponse] = useState('');
  const [selectedAIId, setSelectedAIId] = useState<string>('');
  const [isEditingAI, setIsEditingAI] = useState<boolean>(false);

  const selectedAI = props.AIs.find((ai: AI) => ai._id === selectedAIId);

  const aiOptions = props.AIs.map((ai: AI) => ({
    value: `${ai._id}`,
    name: ai.name,
  }));

  useEffect(() => {
    console.log('set selected ai id');
    if (
      (
        selectedAIId === ''
        || !props.AIs.find((ai: AI) => ai._id === selectedAIId)
      )
      && props.AIs.length > 0
    ) {
      setSelectedAIId(props.AIs[0]._id);
    }
  }, [props.AIs, selectedAIId]);

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
      if (!selectedAI) return;

      setIsStreamingResponse(true);
      const BASE_URL = process.env.VITE_BASE_URL;
      const LLM_PORT = process.env.VITE_LLM_PORT;

      const response = await fetch(`http://${BASE_URL}:${LLM_PORT}/api/chat`, {
        method: 'POST',
        body: JSON.stringify({
          model: selectedAI.aiModel,
          messages: [
            {
              role: "system",
              content: selectedAI.context,
            },
            ...messages
          ],
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

  function handleUpdateInputText(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (event?.target?.value) {
      setInputText(event.target.value);
    }
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
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

  let editAIDialog;
  if (selectedAI && isEditingAI) {
    editAIDialog = (
      <EditAIDialog
        ai={selectedAI}
        close={() => setIsEditingAI(false)}
        save={(ai) => {
          console.log(ai);
          setIsEditingAI(false)
          props.updateAI(ai);
        }}
        delete={(aiId) => {
          setIsEditingAI(false)
          props.deleteAI(aiId);
        }}
      />
    );
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
      <div className="flex flex-col max-h-[20vw] max-w-4xl px-6 min-w-full">
        <TextArea
          value={inputText}
          onChange={handleUpdateInputText}
          onKeyDown={handleInputKeyDown}
        />
        <AlignedRow>
          <div className="flex">
            <Select
              options={aiOptions}
              value={selectedAIId}
              onChange={e => setSelectedAIId(e.target.value)}
            />
            <Button
              onClick={e => setIsEditingAI(true)}
            >
              Edit AI
            </Button>
            <Button
              onClick={e => props.createNewAI({
                ...dummyAI,
                name: `New AI ${aiOptions.length + 1}`,
              })}
            >
              New AI
            </Button>
          </div>
        </AlignedRow>
      </div>
      {editAIDialog}
    </div>
  );
}

export default Chat;
