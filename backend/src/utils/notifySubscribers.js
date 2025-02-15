import { SubscriptionCollection } from '../db/models/subscription.js';
import { TaskCollection } from '../db/models/task.js';

const notifySubscribers = async (taskId, io) => {
    console.log(`notifySubscribers вызван для задания: ${taskId}`);
  
    const subscriptions = await SubscriptionCollection.find({ taskId });
    console.log(`Найдено подписчиков:`, subscriptions.length);
  
    subscriptions.forEach(sub => {
      console.log(`Отправляем уведомление пользователю ${sub.workerId}`);
      io.to(sub.workerId.toString()).emit("taskCompleted", { taskId });
    });
  };
  
  

export const updateTaskStatus = async (taskId, status, io) => {
  const task = await TaskCollection.findById(taskId);
  task.status = status;
  await task.save();

  if (status === 'completed') {
    await notifySubscribers(taskId, io);
  }
};
