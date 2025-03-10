import cron from 'node-cron';
import { wbUpdateReviews } from './wb-reviews';
import * as task from './task';
import { createLog } from './log';

const CRON_WB_FEEDBACKS = process.env.CRON_WB_FEEDBACKS || '*/1 * * * *';
let CRON_WBREVIEWS_IS_RUNNING = false;

async function updateWBReviews() {
  if (CRON_WBREVIEWS_IS_RUNNING) {
    return;
  }
  CRON_WBREVIEWS_IS_RUNNING = true;

  try {
    const uncompletedTask = await task.getUncompletedTask();
    if (!uncompletedTask) {
      CRON_WBREVIEWS_IS_RUNNING = false;
      return;
    }

    await wbUpdateReviews();
    await task.setAsCompleted(uncompletedTask._id.toString());
  } catch (error) {
    CRON_WBREVIEWS_IS_RUNNING = false;
    if (error instanceof Error) await createLog(error.message);
  }

  CRON_WBREVIEWS_IS_RUNNING = false;
}

export const cronTaskUpdateWBReviews = cron.schedule(
  CRON_WB_FEEDBACKS,
  updateWBReviews,
  { scheduled: false },
);
