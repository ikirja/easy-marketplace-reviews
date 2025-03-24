import axios from 'axios';
import { DB } from '../db';
import {
  WBReviewResponse,
  LocalReviewUpdateQuery,
  WBReview,
} from '../../../types/mp-reviews';

const url =
  process.env.WB_FEEDBACKS_URL ||
  'https://feedbacks-api.wildberries.ru/api/v1/feedbacks';
const token = process.env.WB_TOKEN;

const isAnswered = 'true';
const take = '5000';
const order = 'dateDesc';

async function getReviewsFromWB(skip: string): Promise<WBReviewResponse> {
  const params = new URLSearchParams();

  params.set('isAnswered', isAnswered);
  params.set('take', take);
  params.set('skip', skip);
  params.set('order', order);

  const response = await axios({
    url: url,
    headers: {
      Authorization: token,
    },
    params: params,
  });

  return response.data;
}

async function dbWbReviewsUpdate(reviews: Array<WBReview>) {
  const db = new DB();
  const bulkArr: Array<LocalReviewUpdateQuery> = [];

  reviews.forEach((review) => {
    bulkArr.push({
      updateOne: {
        filter: { wbFeedbackId: review.id },
        update: {
          updatedAt: Date.now(),
          wbFeedbackId: review.id,
          text: review.text,
          pros: review.pros,
          cons: review.cons,
          productId: review.productDetails.supplierArticle,
          productValuation: review.productValuation,
        },
        upsert: true,
      },
    });
  });

  await db.models.wbReview.bulkWrite(bulkArr);
}

export async function getReviews() {
  const db = new DB();

  return await db.models.wbReview.find();
}

export async function updateReviews() {
  if (!token) throw new Error('wb token not provided');

  const step = 5000;
  let skip = 0;
  let isFinished = false;

  while (!isFinished) {
    const reviewsData = await getReviewsFromWB(skip.toString());

    if (!reviewsData.data.feedbacks.length) {
      isFinished = true;
      continue;
    }

    await dbWbReviewsUpdate(reviewsData.data.feedbacks);

    skip += step;
  }
}
