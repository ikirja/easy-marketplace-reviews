import mongoose from 'mongoose';

const wbReviewSchema = new mongoose.Schema({
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

const taskSchema = new mongoose.Schema({
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
});

const logSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
});

export const WBReviewModel = mongoose.model('WBReview', wbReviewSchema);
export const TaskModel = mongoose.model('Task', taskSchema);
export const LogModel = mongoose.model('Log', logSchema);
