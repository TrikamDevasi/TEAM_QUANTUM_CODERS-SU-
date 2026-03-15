import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role:      { type: String, enum: ['user', 'assistant'], required: true },
    content:   { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

// One session per user (upsert pattern)
ChatSessionSchema.index({ userId: 1 }, { unique: true });

const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
export default ChatSession;
