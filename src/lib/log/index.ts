import { DB } from '../db';

import { AiLogType } from '../../../types/db';

export async function createLog(text: string): Promise<void> {
  const db = new DB();

  await db.models.log.create(text);
}

export async function getLogs() {
  const db = new DB();

  return await db.models.log.find().sort({ createdAt: -1 });
}

export async function createAiLog(
  text: string,
  type: AiLogType,
): Promise<void> {
  const db = new DB();

  await db.models.aiLog.create({ text: text, type: type });
}

export async function getAiLogs() {
  const db = new DB();

  return await db.models.aiLog.find().sort({ createdAt: -1 });
}

export async function getTodaysAiLogs() {
  const db = new DB();

  return await db.models.aiLog
    .find({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0),
        $lt: new Date().setHours(23, 59, 59),
      },
    })
    .sort({ createdAt: -1 });
}
