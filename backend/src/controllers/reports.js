import {
    getAllTasksSummary,
    getTasksByDay,
    getTasksByWeek,
    getTasksByMonth,
    getTasksByHalfYear,
    getTasksByYear,
} from '../services/reports.js';

export const getAllTasksSummaryController = async (req, res) => {
    try {
        const result = await getAllTasksSummary();
        res.status(200).json(result); // повертаємо як статистику, так і завдання
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByDayController = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: 'Invalid or missing date parameter.' });
        }

        const tasks = await getTasksByDay(new Date(date));
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByWeekController = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: 'Invalid or missing date parameter.' });
        }

        const tasks = await getTasksByWeek(new Date(date));
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTasksByMonthController = async (req, res) => {
    try {
        const { date } = req.query;
        const tasks = await getTasksByMonth(new Date(date));
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByHalfYearController = async (req, res) => {
    try {
        const { date } = req.query;
        const tasks = await getTasksByHalfYear(new Date(date));
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasksByYearController = async (req, res) => {
    try {
        const { date } = req.query;
        const tasks = await getTasksByYear(new Date(date));
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
