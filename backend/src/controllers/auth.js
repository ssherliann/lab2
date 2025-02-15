import { registerUser, loginUser, logoutUser } from "../services/auth.js";
import { THIRTY_DAYS } from '../constants/index.js';
import { refreshUsersSession } from '../services/auth.js';
import { UsersCollection } from "../db/models/user.js";

export const registerUserController = async (req, res) => {
    const payload = {
        ...req.body,
        role: req.body.role || 'employee',
    };

    const { user, accessToken } = await registerUser(payload);

    res.json({
        status: 201,
        message: 'Successfully registered a user!',
        data: {
            user,
            accessToken, // Добавляем access token
        },
    });
};


export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });


    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
            userId: session.userId,
            role: session.role,
        },
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    

    res.status(204).send();
};

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
};

export const refreshUserSessionController = async (req, res) => {
    try {
        const session = await refreshUsersSession({
            sessionId: req.cookies.sessionId,
            refreshToken: req.cookies.refreshToken,
        });

        setupSession(res, session);

        res.json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {
                accessToken: session.accessToken,
            },
        });
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: error.message,
        });
    }
};

export const checkEmailController = async (req, res) => {
    const { email } = req.body; 

    try {
        const user = await UsersCollection.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({ exists: true });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};