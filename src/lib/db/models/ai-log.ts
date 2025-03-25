import { Schema, model } from 'mongoose';

import { AiLogType } from '../../../../types/db';

interface AiLog {
  createdAt: Date;
  text: string;
  type: AiLogType;
}

const aiLogSchema = new Schema<AiLog>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default model<AiLog>('AiLog', aiLogSchema);
