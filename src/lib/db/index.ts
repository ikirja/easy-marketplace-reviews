import { WBReviewModel, TaskModel, LogModel } from './models';

type Models = {
  wbReview: typeof WBReviewModel;
  task: typeof TaskModel;
  log: typeof LogModel;
};

export class DB {
  public models: Models;

  constructor() {
    this.models = {
      wbReview: WBReviewModel,
      task: TaskModel,
      log: LogModel,
    };
  }
}
