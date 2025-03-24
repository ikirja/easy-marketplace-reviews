import { Request, Response } from 'express';
import * as task from '../../../lib/task';

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
  const supportedTypes = [
    'wbreviews',
    'ozonreviews',
    'aisummwbreviews',
    'aisummozonreviews',
  ];

  return supportedTypes.includes(type);
}
