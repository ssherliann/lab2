import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  isRead: { type: Boolean, default: false },
  message: String,
});

export const NotificationCollection = mongoose.model('NOTIFICATIONS', notificationSchema);

