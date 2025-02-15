import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from "../db/models/user.js";


export const registerUser = async (payload) => {
    const existingUser = await UsersCollection.findOne({ email: payload.email });
    if (existingUser) throw createHttpError(409, 'Email in use');
    
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    
    const newUser = await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });

    // Создаем новую сессию с токенами
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    await SessionsCollection.create({
        userId: newUser._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });

    // Возвращаем пользователя и токен
    return {
        user: newUser,
        accessToken,
    };
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    // Удаляем старую сессию
    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    // Создаем новую сессию и сохраняем роль пользователя
    const session = await SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() +  THIRTY_DAYS),
    });

    // Возвращаем объект сессии вместе с ролью пользователя
    return {
        ...session.toObject(), // Конвертируем сессию в обычный объект
        role: user.role, // Добавляем роль пользователя
    };
};


export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    await SessionsCollection.deleteOne({ _id: sessionId });

    const newSession = createSession();

    const newSessionRecord = await SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });

    return newSessionRecord;
};