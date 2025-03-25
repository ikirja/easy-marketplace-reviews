import { Schema, model } from 'mongoose';

interface Log {
  createdAt: Date;
  text: string;
}

const logSchema = new Schema<Log>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
});

export default model<Log>('Log', logSchema);
