import mongoose from 'mongoose';
import { ROLES } from '../../constants/index.js';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [ROLES.ADMIN, ROLES.EMPLOYEE],
            default: ROLES.EMPLOYEE,
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
);

export const UsersCollection = mongoose.model('USERS', userSchema);
