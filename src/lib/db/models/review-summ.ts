import { Schema, model } from 'mongoose';

import { FeedbackType } from '../../../../types/db';

interface ReviewSummarization {
  createdAt: Date;
  updatedAt: Date;
  feedbackType: FeedbackType;
  id: string;
  reviews: string[];
  productId: string;
  productValuation: number;
}

const reviewSummarizationSchema = new Schema<ReviewSummarization>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  feedbackType: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: String,
      default: '',
    }
  ],
  productId: {
    type: String,
    required: true,
  },
  productValuation: {
    type: Number,
    required: true,
  },
});

export default model<ReviewSummarization>('ReviewSummarization', reviewSummarizationSchema);