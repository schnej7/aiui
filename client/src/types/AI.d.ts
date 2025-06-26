export type AI = {
  _id: string;
  name: string;
  aiModel: string;
  context: string;
}

export type NewAI = Pick<AI, "name" | "aiModel" | "context">;

export type AIs = AI[];
