import { Schema, model } from 'mongoose';

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

export default model<WBReview>('WBReview', wbReviewSchema);