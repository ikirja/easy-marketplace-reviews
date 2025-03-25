import { Schema, model, Types } from 'mongoose';

import { TaskType } from '../../../../types/db';

interface Task {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isComplete: boolean;
  task: TaskType;
}

const taskSchema = new Schema<Task>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  task: {
    type: String,
    default: TaskType.WBReviews,
    required: true,
  },
});

export default model<Task>('Task', taskSchema);