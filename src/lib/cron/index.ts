import cron from 'node-cron';
import mpReviews from '../mp-reviews';
import * as task from '../task';
import { createLog } from '../log';

const CRON_TIME_WB_FEEDBACKS = process.env.CRON_WB_FEEDBACKS || '*/1 * * * *';

const FLAGS = {
  isRunning: {
    mpReviews: {
      wildberries: false,
    },
  },
};

async function updateWBReviews() {
  if (FLAGS.isRunning.mpReviews.wildberries) {
    return;
  }
  FLAGS.isRunning.mpReviews.wildberries = true;

  try {
    const uncompletedTask = await task.getUncompletedTask('wbreviews');
    if (!uncompletedTask) {
      FLAGS.isRunning.mpReviews.wildberries = false;
      return;
    }

    await mpReviews.wbReviews.updateReviews();
    await task.setAsCompleted(uncompletedTask._id.toString());
  } catch (error) {
    if (error instanceof Error) {
      await createLog(error.message);
    }
  }

  FLAGS.isRunning.mpReviews.wildberries = false;
}

export const cronTaskUpdateWBReviews = cron.schedule(
  CRON_TIME_WB_FEEDBACKS,
  updateWBReviews,
  { scheduled: false },
);
