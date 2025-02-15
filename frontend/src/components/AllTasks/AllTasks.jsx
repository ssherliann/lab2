import { useState } from "react";

const AllTasks = ({ task }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [taskStatus, setTaskStatus] = useState(task.status);

  // Подписка на задачу
  const subscribeToTask = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Токен не найден!");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/tasks/subscribe`,  // Без ID
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId: task._id })  // Отправляем taskId в теле запроса
        }
      );

      const data = await response.json();
      if (data.message === "Подписка успешна!") {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Ошибка при подписке на задание:", error);
    }
  };

  // Отписка от задания
  const unsubscribeFromTask = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Токен не найден!");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/tasks/unsubscribe`,  // Без ID
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId: task._id })  // Отправляем taskId в теле запроса
        }
      );

      const data = await response.json();
      if (data.message === "Отписка успешна!") {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Ошибка при отписке от задания:", error);
    }
  };

  return (
    <div style={taskStyles}>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>Status: {taskStatus}</p>
      <p>Priority: {task.priority}</p>
      <p>Email: {task.email}</p>
      <p>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "N/A"}</p>
      <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "N/A"}</p>

      {!isSubscribed ? (
        <button onClick={subscribeToTask}>Подписаться</button>
      ) : (
        <button onClick={unsubscribeFromTask}>Отписаться</button>
      )}
    </div>
  );
};

const taskStyles = {
  border: "1px solid #ccc",
  padding: "15px",
  margin: "10px 0",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
  width: "25%",
};

export default AllTasks;
