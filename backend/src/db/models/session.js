import mongoose, { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'USERS',
            required: true
        },
        accessToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        accessTokenValidUntil: {
            type: Date,
            required: true
        },
        refreshTokenValidUntil: {
            type: Date,
            required: true
        }
    }, 
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
);

export const SessionsCollection = model('sessions', sessionSchema);
