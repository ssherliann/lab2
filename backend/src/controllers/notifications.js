import { NotificationCollection } from "../db/models/Notification.js";

export const getNotifications = async (req, res) => {
    const { workerId } = req.query;  // Получаем id работника из параметров
  
    try {
      const notifications = await NotificationCollection.find({ workerId }).sort({ createdAt: -1 });
      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка получения уведомлений' });
    }
  };

