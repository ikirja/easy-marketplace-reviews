import cron from 'node-cron';
import mpReviews from '../mp-reviews';
import * as task from '../task';
import * as log from '../log';

import { TaskType } from '../../../types/db';
import { OpenrouterLimits } from '../../../types/easy-ai-router';

const CRON_TIME_WB_FEEDBACKS =
  process.env.CRON_TIME_WB_FEEDBACKS || '*/1 * * * *';
const CRON_TIME_WB_FEEDBACKS_SUMMARIZE =
  process.env.CRON_TIME_WB_FEEDBACKS_SUMMARIZE || '*/2 * * * *';
const CRON_TIME_WB_FEEDBACKS_AI_SUMMARIZE =
  process.env.CRON_TIME_WB_FEEDBACKS_AI_SUMMARIZE || '*/5 * * * *';

const FLAGS = {
  isRunning: {
    mpReviews: {
      wildberries: false,
    },
    summarizeReviews: {
      wildberries: false,
    },
    aiSummarizeReviews: {
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
    const uncompletedTask = await task.getUncompletedTask(TaskType.WBReviews);
    if (!uncompletedTask) {
      FLAGS.isRunning.mpReviews.wildberries = false;
      return;
    }

    await mpReviews.wbReviews.updateReviews();
    await task.setAsCompleted(uncompletedTask._id.toString());
  } catch (error) {
    if (error instanceof Error) {
      await log.createLog(error.message);
    }
  }

  FLAGS.isRunning.mpReviews.wildberries = false;
}

async function summarizeWBReviews() {
  if (FLAGS.isRunning.summarizeReviews.wildberries) {
    return;
  }
  FLAGS.isRunning.summarizeReviews.wildberries = true;

  try {
    const uncompletedTask = await task.getUncompletedTask(
      TaskType.SummarizeWBReviews,
    );
    if (!uncompletedTask) {
      FLAGS.isRunning.summarizeReviews.wildberries = false;
      return;
    }

    const MINIMUM_PRODUCT_VALUATION = 4;
    await mpReviews.wbReviews.addReviewSumms(MINIMUM_PRODUCT_VALUATION);
    await task.setAsCompleted(uncompletedTask._id.toString());
  } catch (error) {
    if (error instanceof Error) {
      await log.createLog(error.message);
    }
  }

  FLAGS.isRunning.summarizeReviews.wildberries = false;
}

async function aiSummarizeWBReviews() {
  if (FLAGS.isRunning.aiSummarizeReviews.wildberries) {
    return;
  }
  FLAGS.isRunning.aiSummarizeReviews.wildberries = true;

  try {
    const todaysAiLogs = await log.getTodaysAiLogs();
    if (todaysAiLogs.length >= OpenrouterLimits.FreeLimit) {
      FLAGS.isRunning.aiSummarizeReviews.wildberries = false;
      return;
    }

    const uncompletedTask = await task.getUncompletedTask(
      TaskType.AISummarizeWBReviews,
    );
    if (!uncompletedTask) {
      FLAGS.isRunning.aiSummarizeReviews.wildberries = false;
      return;
    }

    const REQUEST_LIMIT_PER_CRON_TASK = 10;
    const taskIsComplete = await mpReviews.wbReviews.updateReviewSummsAI(REQUEST_LIMIT_PER_CRON_TASK);
    if (taskIsComplete) {
      await task.setAsCompleted(uncompletedTask._id.toString());
    }
  } catch (error) {
    if (error instanceof Error) {
      await log.createLog(error.message);
    }
  }

  FLAGS.isRunning.aiSummarizeReviews.wildberries = false;
}

export const cronTaskUpdateWBReviews = cron.schedule(
  CRON_TIME_WB_FEEDBACKS,
  updateWBReviews,
  { scheduled: false },
);

export const cronTaskSummarizeWBReviews = cron.schedule(
  CRON_TIME_WB_FEEDBACKS_SUMMARIZE,
  summarizeWBReviews,
  { scheduled: false },
);

export const cronTaskAiSummarizeWBReviews = cron.schedule(
  CRON_TIME_WB_FEEDBACKS_AI_SUMMARIZE,
  aiSummarizeWBReviews,
  { scheduled: false },
);
