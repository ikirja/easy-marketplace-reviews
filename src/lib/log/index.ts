import { DB } from '../db';

export async function createLog(text: string): Promise<void> {
  const db = new DB();

  await db.models.log.create(text);
}

export async function getLogs() {
  const db = new DB();

  return await db.models.log.find().sort({ createdAt: -1 });
}
