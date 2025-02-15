import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import styles from './Task.module.css';

const Task = ({ task, onDelete, onUpdate }) => {
    return (
      <div className={styles.taskContainer}>
        <div className={styles.taskInfo}>
          <h3>{task.name}</h3>
          <p className={styles.description}>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Priority: {task.priority}</p>
          <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p> 
          <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}</p> 
        </div>
        <div className={styles.tasksButtons}>
          <button className={styles.updateButton} onClick={() => onUpdate(task)}><MdEdit size="20" />Update Task</button>
          <button className={styles.deleteButton} onClick={() => onDelete(task._id)}><MdDeleteForever size="20" /></button>
        </div>
      </div>
    );
};

export default Task;
