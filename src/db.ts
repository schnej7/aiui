import mongoose, { Schema, Document, model } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

export interface IUser extends Document {
  username: string;
  password: string;  // plaintext for demo — hash in production!
  name: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

export const User = model<IUser>('User', UserSchema);
