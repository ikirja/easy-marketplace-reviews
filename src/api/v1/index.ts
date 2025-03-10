import { Router, Request, Response } from 'express';
import { wbGetReviews } from '../../lib/wb-reviews';
import { getTasks, createTask } from '../../lib/task';
const router = Router();

router.get('/reviews/wb', async (req: Request, res: Response) => {
  let reviews = [];

  try {
    reviews = await wbGetReviews();
  } catch (error) {
    return res.json({ error: true });
  }

  res.json({ success: true, data: reviews });
});

router.get('/task', async (req: Request, res: Response) => {
  let tasks = [];

  try {
    tasks = await getTasks();
  } catch (error) {
    return res.json({ error: true });
  }

  res.json({ success: true, data: tasks });
});

router.post('/task', async (req: Request, res: Response) => {
  try {
    await createTask();
  } catch (error) {
    return res.json({ error: true });
  }

  res.json({ success: true });
});

export const apiV1 = router;
