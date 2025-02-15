import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllTasks from '../../components/AllTasks/AllTasks.jsx';
import { 
    getAllTasksSummaryReport,  
    deleteTask,
} from '../../api.js';
import styles from './AllTasksPage.module.css';
import Notifications from '../../components/Notifications.jsx';

const POLLING_INTERVAL = 5000; // Интервал обновления (5 секунд)

const AllTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortType] = useState('priority');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); 

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getAllTasksSummaryReport();
            setTasks(response.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(); // Первоначальная загрузка данных

        const interval = setInterval(() => {
            fetchTasks();
        }, POLLING_INTERVAL);

        return () => clearInterval(interval); // Очистка при размонтировании
    }, []);

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            fetchTasks(); // Запрос после удаления, чтобы обновить список
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
            <Notifications />
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
                                    <AllTasks 
                                        key={task._id || index} 
                                        task={task} 
                                        onDelete={handleDeleteTask}
                                        userId={userId}
                                    />
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

export default AllTasksPage;
