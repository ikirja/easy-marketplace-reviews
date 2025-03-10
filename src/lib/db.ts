import { WBReview, LocalReviewUpdateQuery } from '../../types/review';
import { WBReviewModel, TaskModel, LogModel } from './db-models';

export async function dbWbReviewsGetAll() {
  return await WBReviewModel.find();
}

export async function dbWbReviewsUpdate(reviews: Array<WBReview>) {
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

  await WBReviewModel.bulkWrite(bulkArr);
}

export async function dbTaskGetAll() {
  return await TaskModel.find().sort({ createdAt: -1 });
}

export async function dbTaskCreate() {
  const foundTask = await TaskModel.findOne({ isComplete: false });
  if (foundTask) throw new Error('uncompleted task is found');

  await TaskModel.create({});
}

export async function dbTaskComplete(id: string) {
  const foundTask = await TaskModel.findOne({ _id: id });
  if (!foundTask) throw new Error('task not found');

  foundTask.isComplete = true;

  await foundTask.save();
}

export async function dbLogsGetAll() {
  return await LogModel.find().sort({ createdAt: -1 });
}

export async function dbLogCreate(text: string) {
  await LogModel.create({ text });
}
