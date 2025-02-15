import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AdminTask from '../AdminTask/AdminTask.jsx';
import { 
    getAllTasksSummaryReport,  
    deleteTask } 
from '../../api.js';
import styles from './AdminTaskList.module.css';


const AdminTaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortType] = useState('priority');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await  getAllTasksSummaryReport();
                setTasks(tasks.tasks);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDeleteTask = async (id) => {
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

    return (
        <>
        <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
        <div className={styles.taskList}>
            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <>
                    <div className={styles.filters}>
                        <h2>Filters</h2>
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
                                className={selectedStatus === 'All' ? styles.activeButton : styles.buttonStatus} 
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

                    <p className={styles.taskCount}>Total Tasks: {sortedTasks.length}</p>
                    <div className={styles.tasks}>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task, index) => (
                                <AdminTask key={task._id || index} task={task} onDelete={handleDeleteTask} />
                            ))
                        ) : (
                            <p className={styles.noTasks}>No tasks available</p>
                        )}
                    </div>
                </>
            )}
        </div>
        </>
    );
};

export default AdminTaskList;
