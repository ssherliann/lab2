import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getAllTasksForAdmin, getTasksByStatus} from '../services/tasks.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { TaskCollection } from '../db/models/task.js';
import { NotificationCollection } from '../db/models/Notification.js';

export const getTasksController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;  
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);

        const tasks = await getAllTasks({
            userId,
            page,
            perPage,
            sortBy,
            sortOrder,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully found tasks!',
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskByIdController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const taskId = req.params.taskId;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new Error('Invalid task ID');
        }

        const task = await getTaskById(taskId, userId);

        if (!task) {
            next(createHttpError(404, 'Task not found'));
            return;
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found task with id ${taskId}!`,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const createTaskController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        
        const task = await createTask({ ...req.body, userId });

        res.status(201).json({
            status: 201,
            message: `Successfully created a task!`,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const patchTaskController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;  // Получаем ID пользователя из токена
        const { taskId } = req.params;  // Извлекаем taskId из параметров запроса

        const updatedTask = req.body;  // Извлекаем данные, которые нужно обновить

        // Обновляем задачу через сервис
        const result = await updateTask(taskId, userId, updatedTask);

        if (!result) {
            next(createHttpError(404, 'Task not found'));  // Если задача не найдена
            return;
        }

        // Отправляем успешный ответ
        res.json({
            status: 200,
            message: 'Task successfully updated!',
            data: result,
        });
    } catch (error) {
        next(error);  // В случае ошибки передаем её дальше
    }
};

export const deleteTaskController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { taskId } = req.params;

        const task = await deleteTask(taskId, userId);

        if (!task) {
            return next(createHttpError(404, 'Task not found'));
        }

        res.status(204).send();
    } catch (error) {
        next(createHttpError(500, error.message));
    }
};

export const getAllTasksForReportController = async (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);

        const tasks = await getAllTasksForAdmin({
            page,
            perPage,
            sortBy,
            sortOrder,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully found all tasks!',
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const getTasksByStatusController = async (req, res, next) => {
    const { status } = req.query; // Получаем статус из параметров запроса
    console.log('Received status:', status); // Логируем статус

    try {
        if (!status) {
            return next(createHttpError(400, 'Status query parameter is required'));
        }

        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return next(createHttpError(400, `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`));
        }

        const tasks = await getTasksByStatus(status);
        console.log('Retrieved tasks:', tasks); // Логируем задачи

        if (!tasks.length) {
            return res.status(404).json({
                status: 404,
                message: 'No tasks found with the specified status.',
                data: [],
            });
        }

        res.json({
            status: 200,
            message: 'Successfully retrieved tasks!',
            data: tasks,
        });
    } catch (error) {
        console.error('Error occurred:', error); // Логируем ошибку
        next(createHttpError(500, 'Something went wrong'));
    }
};

export const updateTaskStatus = async (req, res) => {
    const { taskId, newStatus } = req.body;
  
    try {
      const task = await TaskCollection.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Задание не найдено' });
      }
  
      task.status = newStatus;
      await task.save();
  
      // Если статус изменился на "выполнено", отправляем уведомления подписанным работникам
      if (newStatus === 'completed') {
        const subscriptions = await NotificationCollection.find({ taskId: task._id, isRead: false });
        subscriptions.forEach(async (subscription) => {
          await NotificationCollection.create({
            workerId: subscription.workerId,
            taskId: task._id,
            message: `Задание "${task.name}" выполнено.`,
          });
        });
      }
  
      res.status(200).json({ message: 'Статус задания обновлен' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка обновления статуса задания' });
    }
  };

export const subscribeToTask = async (req, res) => {
    const { workerId, taskId } = req.body;
  
    try {
      const task = await TaskCollection.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Задание не найдено' });
      }
  
      const message = `Задание "${task.name}" выполнено.`;
      
      // Создаем уведомление для подписавшегося работника
      await NotificationCollection.create({ workerId, taskId, message });
  
      res.status(200).json({ message: 'Вы подписались на задание' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка подписки на задание' });
    }
  };