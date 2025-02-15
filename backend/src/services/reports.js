import { TaskCollection } from '../db/models/task.js';

const calculateTaskStats = (tasks) => {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in progress').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

    return {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        lowPriorityTasks,
        mediumPriorityTasks,
        highPriorityTasks,
        tasks, 
    };
};

// Зведений звіт
export const getAllTasksSummary = async () => {
    try {
        const tasks = await TaskCollection.find();
        return calculateTaskStats(tasks);
    } catch (error) {
        throw new Error("Error retrieving tasks: " + error.message);
    }
};

// Завдання за день
export const getTasksByDay = async (date) => {
    // Определяем начало и конец указанного дня
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Получаем задачи за указанный день из базы данных
    const tasks = await TaskCollection.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).populate('userId', 'name email');

    return calculateTaskStats(tasks);
};

// Завдання за тиждень
export const getTasksByWeek = async (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const tasks = await TaskCollection.find({
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate('userId', 'name email');

    return calculateTaskStats(tasks);
};

// Завдання за місяць
export const getTasksByMonth = async (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const tasks = await TaskCollection.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).populate('userId', 'name email');

    return calculateTaskStats(tasks);
};

// Завдання за пів року
export const getTasksByHalfYear = async (date) => {
    const startOfHalfYear = new Date(date.getFullYear(), date.getMonth() >= 6 ? 6 : 0, 1);
    const endOfHalfYear = new Date(date.getFullYear(), date.getMonth() >= 6 ? 12 : 6, 0, 23, 59, 59, 999);

    const tasks = await TaskCollection.find({
        createdAt: { $gte: startOfHalfYear, $lte: endOfHalfYear },
    }).populate('userId', 'name email');

    return calculateTaskStats(tasks);
};


// Завдання за рік
export const getTasksByYear = async (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

    const tasks = await TaskCollection.find({
        createdAt: { $gte: startOfYear, $lte: endOfYear },
    }).populate('userId', 'name email');

    return calculateTaskStats(tasks);
};

