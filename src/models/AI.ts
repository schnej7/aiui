import mongoose, { Schema, Document } from 'mongoose';

export interface IAI extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  aiModel: string;
  context: string;
}

const aiConfigSchema = new Schema<IAI>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'New AI' },
  aiModel: { type: String, default: 'llama3.1' },
  context: { type: String, default: '' },
});

export const AIConfig = mongoose.model<IAI>('AIConfig', aiConfigSchema);
