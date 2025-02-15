import { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/http://localhost:3000/tasks/notifications');  // Получаем уведомления с сервера
        setNotifications(res.data);
      } catch (error) {
        console.error('Ошибка получения уведомлений:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications">
      {notifications.map((notification) => (
        <div key={notification._id} className="notification">
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
