import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        workerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },  
        taskId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Task' 
        },   
        subscribedAt: { type: Date, default: Date.now }
    }
);

export const SubscriptionCollection = mongoose.model("SUBSCRIPTIONS", subscriptionSchema);
