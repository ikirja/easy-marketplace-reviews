import { Schema, model, Types } from 'mongoose';

interface WBReview {
  createdAt: Date;
  updatedAt: Date;
  wbFeedbackId: string;
  text: string;
  pros: string;
  cons: string;
  productId: string;
  productValuation: number;
}

const wbReviewSchema = new Schema<WBReview>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  wbFeedbackId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  pros: {
    type: String,
    default: '',
  },
  cons: {
    type: String,
    default: '',
  },
  productId: {
    type: String,
    required: true,
  },
  productValuation: {
    type: Number,
    required: true,
  },
});

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

export const WBReviewModel = model<WBReview>('WBReview', wbReviewSchema);
export const TaskModel = model<Task>('Task', taskSchema);
export const LogModel = model<Log>('Log', logSchema);
