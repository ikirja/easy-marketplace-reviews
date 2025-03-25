import axios from 'axios';
import { DB } from '../db';
import easyAi from '../easy-ai-router';
import * as log from '../log';

import {
  WBReviewResponse,
  LocalReviewUpdateQuery,
  WBReview,
  ReviewByProducts,
  ProductReviews,
} from '../../../types/mp-reviews';
import { FeedbackType, AiReviewSummData, AiLogType } from '../../../types/db';
import { Message, Role } from '../../../types/easy-ai-router';

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

async function dbReviewSummsCreate(reviews: Array<ProductReviews>) {
  const db = new DB();

  await db.models.reviewSummarization.create(reviews);
}

async function dbReviewSummsUpdate(review: ProductReviews) {
  const db = new DB();

  const reviewSumm = await db.models.reviewSummarization.findOne({
    productId: review.productId,
  });
  if (!reviewSumm) {
    return;
  }

  if (review.aiData.summary.length) {
    reviewSumm.aiData.summary = review.aiData.summary;
    reviewSumm.isComplete = true;
  }
  if (review.aiData.advantages.length) {
    reviewSumm.aiData.advantages = review.aiData.advantages;
    reviewSumm.isComplete = true;
  }

  await reviewSumm.save();
}

export async function getReviews() {
  const db = new DB();

  return await db.models.wbReview.find();
}

export async function getReviewSumms() {
  const db = new DB();

  return await db.models.reviewSummarization.find();
}

export async function getReviewSummsUncompleted() {
  const db = new DB();

  return await db.models.reviewSummarization.find({ isComplete: false });
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

export async function addReviewSumms(minProductValuation: number) {
  let reviews = await getReviews();
  const reviewSumms = await getReviewSumms();

  reviews = reviews.filter((review) => {
    if (!review.text.length || review.productValuation < minProductValuation) {
      return false;
    }

    const foundReviewSumm = reviewSumms.find(
      (reviewSumm) => reviewSumm.productId === review.productId,
    );
    if (foundReviewSumm) {
      return false;
    }

    return true;
  });

  const reviewsByProducts = {} as ReviewByProducts;

  reviews.forEach((review) => {
    const EMPTY_PRODUCT: ProductReviews = {
      feedbackType: FeedbackType.Wildberries,
      reviews: [],
      productId: review.productId,
      productValuation: review.productValuation,
      isComplete: false,
      aiData: {
        summary: '',
        advantages: [],
      },
    };

    if (!reviewsByProducts[review.productId]) {
      reviewsByProducts[review.productId] = EMPTY_PRODUCT;
    }

    let newReview = review.text.replace('\n', ' ');
    if (review.pros.length) newReview += `. ${review.pros.replace('\n', ' ')}`;
    if (review.cons.length) newReview += `. ${review.cons.replace('\n', ' ')}`;

    reviewsByProducts[review.productId].reviews.push(newReview);
  });

  const newReviewSumms = [];
  for (const productReviews of Object.entries(reviewsByProducts)) {
    newReviewSumms.push(productReviews[1]);
  }

  await dbReviewSummsCreate(newReviewSumms);
}

export async function updateReviewSummsAI(limit: number) {
  let reviewSumms = await getReviewSummsUncompleted();
  reviewSumms = reviewSumms.slice(0, limit);

  const jsonResponseFormat = `
    \`\`\`json
    {
      "productId": "",
      "summary: "",
      "advantages: []",
    }
    \`\`\`
  `;

  const content = `
    Сделай суммаризацию положительных качеств товара на основе отзывов на его. Используй контекст в формате json, отзывы на товар находятся в поле 'reviews', артикул товара находится в поле 'productId'. Ответ должен быть в формате json: ${jsonResponseFormat}. В ответе выдели преимущества в тезисы: 1 тезис - 1 строка в массиве 'advantages'. Контекст: 
  `;

  const updatedReviewSumms = [];
  for (let i = 0; i < reviewSumms.length; i++) {
    const product = {
      productId: reviewSumms[i].productId,
      reviews: reviewSumms[i].reviews,
    };

    const message: Message = {
      role: Role.User,
      content: content,
    };

    message.content += `
      \`\`\`json
      ${JSON.stringify(product, null, 2)}
      \`\`\`
    `;

    const response = await easyAi.openrouter.chat([message]);

    await log.createAiLog('easy-ai-router', AiLogType.AISummarizeWBReviews);

    const parsedJson = easyAi.openrouter.chatResponseJsonParse(
      response.choices[0].message.content,
    ) as AiReviewSummData;

    let hasBeenUpdated = false;

    if (parsedJson?.summary?.length) {
      reviewSumms[i].aiData.summary = parsedJson.summary;
      hasBeenUpdated = true;
    }
    if (parsedJson?.advantages?.length) {
      reviewSumms[i].aiData.advantages = parsedJson.advantages;
      hasBeenUpdated = true;
    }
    if (hasBeenUpdated) {
      updatedReviewSumms.push(reviewSumms[i]);
    }
  }

  for (let i = 0; i < updatedReviewSumms.length; i++) {
    await dbReviewSummsUpdate(updatedReviewSumms[i]);
  }
}
