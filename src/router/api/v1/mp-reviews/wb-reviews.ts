import { Request, Response } from 'express';
import mpReviews from '../../../../lib/mp-reviews';

export async function getReviews(req: Request, res: Response): Promise<void> {
  try {
    const reviews = await mpReviews.wbReviews.getReviews();
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.json({ error: true });
  }
}
