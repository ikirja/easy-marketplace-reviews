import WBReviewModel from './models/wb-review';
import TaskModel from './models/task';
import LogModel from './models/log';

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
