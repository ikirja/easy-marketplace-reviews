import { dbLogCreate } from './db';

export async function createLog(text: string) {
  await dbLogCreate(text);
}
