import { DB } from '../db';

export async function getTasks() {
  const db = new DB();

  return await db.models.task.find().sort({ createdAt: -1 });
}

export async function getUncompletedTask(type: string) {
  const db = new DB();

  const uncompletedTask = await db.models.task.findOne({
    isComplete: false,
    task: type,
  });

  return uncompletedTask;
}

export async function createTask(type: string) {
  const db = new DB();

  const uncompletedTask = await db.models.task.findOne({ isComplete: false });
  if (uncompletedTask) throw new Error('uncompleted task is found');

  await db.models.task.create({ task: type });
}

export async function setAsCompleted(id: string) {
  const db = new DB();

  const foundTask = await db.models.task.findOne({ _id: id });
  if (!foundTask) throw new Error('task not found');

  foundTask.isComplete = true;

  await foundTask.save();
}
