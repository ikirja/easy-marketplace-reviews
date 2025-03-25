import { Schema, model, Types } from 'mongoose';

interface Task {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isComplete: boolean;
  task: Tasks;
}

enum Tasks {
  WBReviews = 'wbreviews',
  OZONReviews = 'ozonreviews',
  AISummarizeWBReviews = 'aisummwbreviews',
  AISummarizeOZONReviews = 'aisummozonreviews',
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
    default: Tasks.WBReviews,
    required: true,
  },
});

export default model<Task>('Task', taskSchema);