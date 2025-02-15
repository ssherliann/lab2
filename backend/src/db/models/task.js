import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "in progress", "completed"],
            required: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USERS",  
            required: true,
        },
        email: {  
            type: String,
            required: true,  
        },
        deadline: {  
            type: Date,
            default: null,  
        },
    }, 
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
);

export const TaskCollection = mongoose.model("TASKS", taskSchema);
