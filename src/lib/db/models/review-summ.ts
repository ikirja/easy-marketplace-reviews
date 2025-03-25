import { Schema, model } from 'mongoose';

import { FeedbackType, AiReviewSummData } from '../../../../types/db';

interface ReviewSummarization {
  createdAt: Date;
  updatedAt: Date;
  feedbackType: FeedbackType;
  id: string;
  reviews: string[];
  productId: string;
  productValuation: number;
  isComplete: boolean;
  aiData: AiReviewSummData;
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
    },
  ],
  productId: {
    type: String,
    required: true,
  },
  productValuation: {
    type: Number,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  aiData: {
    summary: {
      type: String,
      default: '',
    },
    advantages: [
      {
        type: String,
      },
    ],
  },
});

export default model<ReviewSummarization>(
  'ReviewSummarization',
  reviewSummarizationSchema,
);
