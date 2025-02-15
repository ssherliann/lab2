import { TaskCollection } from '../db/models/task.js'; // Импорт модели задачи
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';

export const getAllTasks = async ({
    userId,
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const tasksQuery = TaskCollection.find({ userId });  
    const tasksCount = await TaskCollection.find({ userId })
        .merge(tasksQuery)
        .countDocuments();

    const tasks = await tasksQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

    const paginationData = calculatePaginationData(tasksCount, perPage, page);

    return {
        data: tasks,
        ...paginationData,
    };
};

export const getTaskById = async (taskId, userId) => {
    const task = await TaskCollection.findOne({ _id: taskId, userId });  
    return task;
};

export const createTask = async (payload) => {
    const user = await UsersCollection.findById(payload.userId);

    if (!user) {
        throw new Error('User not found');
    }

    const task = await TaskCollection.create({ 
        ...payload, 
        email: user.email  // Добавляем email пользователя
    });

    return task;
};

export const updateTask = async (taskId, userId, payload) => {
    const task = await TaskCollection.findOneAndUpdate(
        { _id: taskId, userId },  
        payload,
        {
            new: true,
        },
    );

    return task;
};

export const deleteTask = async (taskId, userId) => {
    const task = await TaskCollection.findOneAndDelete({
        _id: taskId,
        userId, 
    });

    return task;
};

export const getAllTasksForAdmin = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const tasksQuery = TaskCollection.find();  // Получаем все задачи без фильтра по userId
    const tasksCount = await TaskCollection.countDocuments();

    const tasks = await tasksQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

    const paginationData = calculatePaginationData(tasksCount, perPage, page);

    return {
        data: tasks,
        ...paginationData,
    };
};

export const getTasksByStatus = async (status) => {
    try {
        const tasks = await TaskCollection.find({ status });
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Database query failed'); // Обработайте ошибку соответствующим образом
    }
};
