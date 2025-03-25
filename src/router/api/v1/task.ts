import { Request, Response } from 'express';
import * as task from '../../../lib/task';

import { TaskType } from '../../../../types/db';

export async function get(req: Request, res: Response): Promise<void> {
  try {
    const tasks = await task.getTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.json({ error: true });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const { type } = req.body;
  if (!type) {
    res.json({ error: true });
    return;
  }

  if (!validateType(type)) {
    res.json({ error: true });
    return;
  }

  try {
    await task.createTask(type);
    res.json({ success: true });
  } catch (error) {
    res.json({ error: true });
  }
}

function validateType(type: string): boolean {
  if (TaskType.WBReviews === type) {
    return true;
  }
  if (TaskType.OZONReviews === type) {
    return true;
  }
  if (TaskType.SummarizeWBReviews === type) {
    return true;
  }
  if (TaskType.SummarizeOZONReviews === type) {
    return true;
  }
  if (TaskType.AISummarizeWBReviews === type) {
    return true;
  }
  if (TaskType.AISummarizeOZONReviews === type) {
    return true;
  }

  return false;
}
