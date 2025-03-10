import axios from 'axios';
import { dbWbReviewsGetAll, dbWbReviewsUpdate } from './db';
import { WBReviewResponse } from '../../types/review';

const url =
  process.env.WB_FEEDBACKS_URL ||
  'https://feedbacks-api.wildberries.ru/api/v1/feedbacks';
const token = process.env.WB_TOKEN;

const isAnswered = 'true';
const take = '5000';
const order = 'dateDesc';

async function getReviews(skip: string): Promise<WBReviewResponse> {
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

export async function wbUpdateReviews() {
  if (!token) throw new Error('wb token not provided');

  const step = 5000;
  let skip = 0;
  let isFinished = false;

  while (!isFinished) {
    const reviewsData = await getReviews(skip.toString());

    if (!reviewsData.data.feedbacks.length) {
      isFinished = true;
      continue;
    }

    await dbWbReviewsUpdate(reviewsData.data.feedbacks);

    skip += step;
  }
}

export async function wbGetReviews() {
  return await dbWbReviewsGetAll();
}