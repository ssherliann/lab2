import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Task from '../Task/Task.jsx';
import { getTasks, createTask, updateTask, deleteTask } from '../../api.js'; 
import { IoCreateOutline } from "react-icons/io5";
import styles from './TaskList.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        status: 'pending',
        priority: 'low',
        deadline: null, 
    });
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortType] = useState('priority'); // 'priority' or 'status'
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await getTasks();
                setTasks(response.data.data);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTasks();
    }, []);

    const handleCreateTask = async () => {
        try {
            console.log('Creating task with data:', newTask);
            const createdTask = await createTask(newTask); 
            setTasks((prevTasks) => [createdTask, ...prevTasks]);
            setNewTask({ name: '', description: '', status: 'pending', priority: 'low', deadline: null });
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };
    
    const handleOpenModal = (task) => {
        const today = new Date();
        if (task.deadline && new Date(task.deadline) < today) {
            alert("The deadline for this task has passed. It cannot be edited.");
            return;
        }
        setTaskToUpdate(task);
        setIsModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        const today = new Date();
        if (updatedTask.deadline && new Date(updatedTask.deadline) < today) {
            alert("The deadline for this task has passed. It cannot be updated.");
            return;
        }

        const { description, priority, name, status } = updatedTask;
        const taskToUpdate = { description, priority, name, status };
    
        try {
            await updateTask(updatedTask._id, taskToUpdate);
            setTasks(tasks.map(task => (task._id === updatedTask._id ? { ...task, ...taskToUpdate } : task)));
            setIsModalOpen(false);
            setTaskToUpdate(null);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };
    

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this task?'); 
        if (!confirmDelete) return; 
    
        try {
            await deleteTask(id); 
            setTasks(tasks.filter(task => task._id !== id)); 
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };
    

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'priority') {
            setSelectedPriority(value);
        } else if (filterType === 'status') {
            setSelectedStatus(value);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTaskToUpdate(null);
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (taskToUpdate) {
            console.log(taskToUpdate)
            handleUpdateTask(taskToUpdate);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesPriority = selectedPriority === 'All' || task.priority.toLowerCase() === selectedPriority.toLowerCase();
        const matchesStatus = selectedStatus === 'All' || task.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesPriority && matchesStatus;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const aPriority = a.priority || '';
        const bPriority = b.priority || '';
        const aStatus = a.status || '';
        const bStatus = b.status || '';

        if (sortType === 'priority') {
            return aPriority.localeCompare(bPriority);
        } else if (sortType === 'status') {
            return aStatus.localeCompare(bStatus);
        }
        return 0;
    });


    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    return (
        <>
        <Link to="/alltasks" className={styles.allTasksButtton}>Go to all tasks</Link>
        <div className={styles.taskList}>
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <>
                    <div className={styles.filters}>
                    <div className={styles.form}>
                        <h2>Add a new task</h2>
                        <input 
                            className={styles.addTaskForm}
                            type="text" 
                            placeholder="Task Name" 
                            value={newTask.name} 
                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} 
                        />
                        <input 
                            className={styles.addTaskForm}
                            type="text" 
                            placeholder="Description" 
                            value={newTask.description} 
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                        />
                        <select 
                            className={styles.addTaskForm}
                            value={newTask.priority} 
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <select 
                            className={styles.addTaskForm}
                            value={newTask.status} 
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className={styles.addTaskFormBottom}>
                            <DatePicker
                            selected={newTask.deadline}
                            onChange={(date) => setNewTask({ ...newTask, deadline: date })}
                            dateFormat="yyyy-MM-dd"
                            className={styles.addTaskForm}
                            placeholderText="Select deadline"
                            minDate={today} 
                            />
                            <button className={styles.addTaskButton} onClick={handleCreateTask}><IoCreateOutline size='18px'/>Create Task</button>
                        </div>
                        
                    </div>


                        <h2>Filter Tasks</h2>
                        <div className={styles.buttonGroup}>
                            <span>Priority:</span>
                            <button 
                                className={selectedPriority === 'All' ? styles.activeButton : styles.buttonPriority} 
                                onClick={() => handleFilterChange('priority', 'All')}
                            >
                                All
                            </button>
                            <button 
                                className={selectedPriority === 'low' ? styles.activeButton : styles.buttonPriority} 
                                onClick={() => handleFilterChange('priority', 'low')}
                            >
                                Low
                            </button>
                            <button 
                                className={selectedPriority === 'medium' ? styles.activeButton : styles.buttonPriority} 
                                onClick={() => handleFilterChange('priority', 'medium')}
                            >
                                Medium
                            </button>
                            <button 
                                className={selectedPriority === 'high' ? styles.activeButton : styles.buttonPriority} 
                                onClick={() => handleFilterChange('priority', 'high')}
                            >
                                High
                            </button>
                        </div>
                        <div className={styles.buttonGroup}>
                            <span>Status:</span>
                            <button 
                                className={selectedStatus === 'All' ? styles.activeButton : styles.buttonPriority} 
                                onClick={() => handleFilterChange('status', 'All')}
                            >
                                All
                            </button>
                            <button 
                                className={selectedStatus === 'pending' ? styles.activeButton : styles.buttonStatus} 
                                onClick={() => handleFilterChange('status', 'pending')}
                            >
                                Pending
                            </button>
                            <button 
                                className={selectedStatus === 'in progress' ? styles.activeButton : styles.buttonStatus} 
                                onClick={() => handleFilterChange('status', 'in progress')}
                            >
                                In Progress
                            </button>
                            <button 
                                className={selectedStatus === 'completed' ? styles.activeButton : styles.buttonStatus} 
                                onClick={() => handleFilterChange('status', 'completed')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    <div className={styles.tasks}>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task, index) => (
                                <Task 
                                    key={task._id || index} 
                                    task={task} 
                                    onUpdate={handleOpenModal} 
                                    onDelete={handleDeleteTask} 
                                />
                            ))
                        ) : (
                            <p className={styles.noTasks}>No tasks available</p>
                        )}
                    </div>

                    {isModalOpen && (
                        <>
                            <div className={styles.modalBackdrop} onClick={closeModal}></div>
                                <div className={styles.modal}>
                                <div className={styles.modalContent}>
                                    <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Edit Task</h2>
                                    </div>
                                    <div className={styles.modalBody}>
                                    <form onSubmit={handleModalSubmit}>
                                        <input
                                        type="text"
                                        placeholder="Task Name"
                                        value={taskToUpdate?.name || ''}
                                        onChange={(e) => setTaskToUpdate({ ...taskToUpdate, name: e.target.value })}
                                        className={styles.inputField}
                                        />
                                        <input
                                        type="text"
                                        placeholder="Description"
                                        value={taskToUpdate?.description || ''}
                                        onChange={(e) => setTaskToUpdate({ ...taskToUpdate, description: e.target.value })}
                                        className={styles.inputField}
                                        />
                                        <select
                                        value={taskToUpdate?.priority || ''}
                                        onChange={(e) => setTaskToUpdate({ ...taskToUpdate, priority: e.target.value })}
                                        className={styles.selectField}
                                        >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        </select>
                                        <select
                                        value={taskToUpdate?.status || ''}
                                        onChange={(e) => setTaskToUpdate({ ...taskToUpdate, status: e.target.value })}
                                        className={styles.selectField}
                                        >
                                        <option value="pending">Pending</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        </select>
                                        <DatePicker
                                        selected={taskToUpdate?.deadline || null}
                                        onChange={(date) => setTaskToUpdate({ ...taskToUpdate, deadline: date })}
                                        dateFormat="yyyy-MM-dd"
                                        minDate={today}
                                        className={styles.datePicker}
                                        placeholderText="Select deadline"
                                        />
                                        <button type="submit" className={styles.saveButton}>Save</button>
                                    </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
        </>
    );
};

export default TaskList;
