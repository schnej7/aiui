import React, { useEffect, useState } from 'react';

import { AI } from '../types/AI';

import AlignedRow from './generic/AlignedRow';
import Button from './generic/Button';
import Dialog from './generic/Dialog';
import Input from './generic/Input';
import TextArea from './generic/TextArea';

type EditAIDialogProps = {
  ai: AI;
  close: () => void;
  save: (ai: AI) => void;
  delete: (aiId: AI["_id"]) => void;
};

export default function EditAIDialog(props: EditAIDialogProps) {
  const [name, setName] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("");
  const [context, setContext] = useState<string>("");

  useEffect(() => {
    setName(props.ai.name);
    setAiModel(props.ai.aiModel);
    setContext(props.ai.context);
  }, []);

  return (
    <Dialog>
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <Input
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          placeholder="AI Model"
        />
        <TextArea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Context"
        />
      </div>
      <AlignedRow>
        <Button
          onClick={() => props.save({
            _id: props.ai._id,
            name,
            aiModel,
            context,
          })}
        >
          Save
        </Button>
        <Button
          onClick={props.close}
        >
          Cancel
        </Button>
        <Button
          onClick={() => props.delete(props.ai._id)}
        >
          Delete
        </Button>
      </AlignedRow>
    </Dialog>
  );
}
