import WBReviewModel from './models/wb-review';
import TaskModel from './models/task';
import LogModel from './models/log';
import ReviewSummarizationModel from './models/review-summ';
import AiLogModel from './models/ai-log';

type Models = {
  wbReview: typeof WBReviewModel;
  task: typeof TaskModel;
  log: typeof LogModel;
  reviewSummarization: typeof ReviewSummarizationModel;
  aiLog: typeof AiLogModel;
};

export class DB {
  public models: Models;

  constructor() {
    this.models = {
      wbReview: WBReviewModel,
      task: TaskModel,
      log: LogModel,
      reviewSummarization: ReviewSummarizationModel,
      aiLog: AiLogModel,
    };
  }
}
