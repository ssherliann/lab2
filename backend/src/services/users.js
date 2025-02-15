import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllUsers = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const tasksQuery = UsersCollection.find(); 
    const tasksCount = await UsersCollection.countDocuments();

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

// Получение пользователя по email
export const getUserByEmail = async (email) => {
    return await UsersCollection.findOne({ email }).exec();
};

// Добавление нового пользователя
export const addUser = async (userData) => {
    const newUser = new UsersCollection(userData);
    return await newUser.save();
};

// Редактирование информации о пользователе
export const updateUser = async (userId, updatedData) => {
    return await UsersCollection.findByIdAndUpdate(userId, updatedData, { new: true }).exec();
};

// Удаление пользователя
export const deleteUser = async (userId) => {
    return await UsersCollection.findByIdAndDelete(userId).exec();
};