import { Request, Response } from 'express';
import easyAI from '../../../../lib/easy-ai-router';
import * as log from '../../../../lib/log';

import { Message, OpenrouterLimits } from '../../../../../types/easy-ai-router';
import { AiLogType } from '../../../../../types/db';

export async function ping(req: Request, res: Response): Promise<void> {
  try {
    const response = await easyAI.openrouter.ping();

    res.status(200).json(response);
  } catch (error) {
    res.status(503).json({ message: 'easy-ai openrouter not available' });
  }
}

export async function key(req: Request, res: Response): Promise<void> {
  try {
    const response = await easyAI.openrouter.key();

    res.status(200).json(response);
  } catch (error) {
    res
      .status(503)
      .json({ message: 'easy-ai openrouter could not get key info' });
  }
}

export async function chat(req: Request, res: Response): Promise<void> {
  const messages = req.body as Message[];

  try {
    const response = await easyAI.openrouter.chat(messages);

    await log.createAiLog('easy-ai-router', AiLogType.FreeForm);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'easy-ai openrouter chat error' });
  }
}

export async function limits(req: Request, res: Response): Promise<void> {
  try {
    const limit = OpenrouterLimits.FreeLimit;
    const used = await log.getTodaysAiLogs();

    res.status(200).json({ limit: limit, used: used });
  } catch (error) {
    res.status(500).json({ message: 'easy-ai openrouter limits error' });
  }
}
