import { addUser, deleteUser, getAllUsers, getUserByEmail, updateUser } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllUsersController = async (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);

        const tasks = await getAllUsers({
            page,
            perPage,
            sortBy,
            sortOrder,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully found all users!',
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

// Получение пользователя по email
export const getUserByEmailController = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found!',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'User found successfully!',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// Добавление нового пользователя
export const addUserController = async (req, res, next) => {
    try {
        const userData = req.body;
        const newUser = await addUser(userData);

        res.status(201).json({
            status: 201,
            message: 'User added successfully!',
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};

// Редактирование информации о пользователе
export const updateUserController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;
        const updatedUser = await updateUser(userId, updatedData);

        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found!',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'User updated successfully!',
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

// Удаление пользователя
export const deleteUserController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const deletedUser = await deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found!',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'User deleted successfully!',
        });
    } catch (error) {
        next(error);
    }
};
