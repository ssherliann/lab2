import express from 'express'; 
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json({
        type: ['application/json', 'application/vnd.api+json'],
    }));

    const corsOptions = {
        origin: function (origin, callback) {
            const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200
    };

    app.use(cors(corsOptions));

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.use(cookieParser());
    app.use(router);
    app.use('*', notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
