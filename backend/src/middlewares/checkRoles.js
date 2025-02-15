import createHttpError from 'http-errors';
import { ROLES } from '../constants/index.js';

export const checkRoles =
    (...roles) =>
    async (req, res, next) => {
        const { user } = req;
        if (!user) {
            return next(createHttpError(401, 'Unauthorized'));
        }

        const { role } = user;
        
        // Проверяем, является ли пользователь администратором
        if (roles.includes(ROLES.ADMIN) && role === ROLES.ADMIN) {
            return next();
        }

        // Проверяем, является ли пользователь работником
        if (roles.includes(ROLES.EMPLOYEE) && role === ROLES.EMPLOYEE) {
            return next();
        }

        // Если ни одна из ролей не соответствует, возвращаем 403
        return next(createHttpError(403, 'Forbidden'));
    };
