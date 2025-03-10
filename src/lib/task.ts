import { dbTaskGetAll, dbTaskCreate, dbTaskComplete } from './db';

export async function getTasks() {
  return await dbTaskGetAll();
}

export async function getUncompletedTask() {
  const tasks = await dbTaskGetAll();
  const uncompletedTask = tasks.find((task) => !task.isComplete);

  return uncompletedTask;
}

export async function createTask() {
  await dbTaskCreate();
}

export async function setAsCompleted(id: string) {
  await dbTaskComplete(id);
}
