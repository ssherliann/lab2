import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllTasksSummaryReport,
    getTasksByDayReport,
    getTasksByWeekReport,
    getTasksByMonthReport,
    getTasksByHalfYearReport,
    getTasksByYearReport,
} from "../../api.js";
import styles from "./AdminReportsList.module.css";

export default function AdminReportsList() {
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [date, setDate] = useState("");
    const navigate = useNavigate(); 

    const fetchAllTasks = async (fetchFunction) => {
        try {
            setError(null);
            const data = await fetchFunction(date);
            setReportData(data);
        } catch(err) {
            setError(err.message || "Error fetching report.");
        }
    }

    const fetchReport = async (fetchFunction) => {
        try {
            if (!date) {
                setError("Please select a date.");
                return;
            }
            setError(null);
            const data = await fetchFunction(date);
            setReportData(data);
        } catch (err) {
            setError(err.message || "Error fetching report.");
        }
    };

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
            <h1 className={styles.title}>Reports</h1>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.dateInput}
            />
            <div className={styles.buttons}>
                <button onClick={() => fetchAllTasks(getAllTasksSummaryReport)}>Summary</button>
                <button onClick={() => fetchReport(getTasksByDayReport)}>Day</button>
                <button onClick={() => fetchReport(getTasksByWeekReport)}>Week</button>
                <button onClick={() => fetchReport(getTasksByMonthReport)}>Month</button>
                <button onClick={() => fetchReport(getTasksByHalfYearReport)}>Half Year</button>
                <button onClick={() => fetchReport(getTasksByYearReport)}>Year</button>
            </div>
            {error && <div className={styles.error}>Error: {error}</div>}
            {reportData && (
                <div className={styles.report}>
                    <h2>Report Details</h2>
                    <p>Total Tasks: {reportData.totalTasks}</p>
                    <p>Pending: {reportData.pendingTasks}</p>
                    <p>In Progress: {reportData.inProgressTasks}</p>
                    <p>Completed: {reportData.completedTasks}</p>
                    <p>Low Priority: {reportData.lowPriorityTasks}</p>
                    <p>Medium Priority: {reportData.mediumPriorityTasks}</p>
                    <p>High Priority: {reportData.highPriorityTasks}</p>
                    <h3>Task List</h3>
                    <ul className={styles.taskList}>
                        {reportData.tasks.map((task, index) => (
                            <li key={task.id || index} className={styles.taskItem}>
                                <p>{task.name}</p>
                                <p>{task.description}</p>
                                <p><strong>Email: </strong>{task.email}</p>
                                <p><strong>Status: </strong> {task.status}</p>
                                <p><strong>Priority: </strong> {task.priority}</p>
                                <p><strong>Created: {new Date(task.createdAt).toLocaleDateString()}</strong></p> 
                                <p><strong>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not set'}</strong></p> 
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
