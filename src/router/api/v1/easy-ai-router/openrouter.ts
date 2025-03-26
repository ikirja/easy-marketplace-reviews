import { Request, Response } from 'express';
import * as log from '../../../../lib/log';

import { OpenrouterLimits } from '../../../../lib/easy-ai-router';

export async function limits(req: Request, res: Response): Promise<void> {
  try {
    const limit = OpenrouterLimits.FreeLimit;
    const todaysAiLogs = await log.getTodaysAiLogs();
    const used = todaysAiLogs.length;

    res.status(200).json({ limit: limit, used: used });
  } catch (error) {
    res.status(500).json({ message: 'easy-ai openrouter limits error' });
  }
}
