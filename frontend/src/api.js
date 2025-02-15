import axios from 'axios'

const API_URL = 'http://localhost:3000'; // Замените на ваш URL сервера

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Позволяет отправлять куки вместе с запросами
});

axios.interceptors.request.use(
    function (config) {
        const { origin } = new URL(config.url);

        const allowedOrigins = ['*'];
        const token = localStorage.getItem("access-token");

        if (allowedOrigins.includes(origin)) {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Аутентификация
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
            },
        });

        if (response.status === 200) {
            const { accessToken, userId } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userId);
            console.log('Successfully registered and access token saved!');
            return response.data;
        }

        // Якщо є специфічна помилка (наприклад, email вже існує)
        throw new Error('Email already exists');
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            if (error.response.status === 409) {
                // Якщо це конфлікт (наприклад, email вже існує), повертаємо відповідне повідомлення
                throw new Error('Email already exists');
            }
            throw new Error(error.response.data.message || 'Error occurred during registration');
        } else {
            console.error('Network error:', error);
            throw new Error('Network error');
        }
    }
};


export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials, {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
            },
        });
        if (response.status === 200) {
            const { accessToken } = response.data.data;
            const { userId } = response.data.data;
            const { role } = response.data.data;
            // Сохраняем accessToken в localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);
            console.log('Successfully logged in and access token saved!');
        }
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const logoutUser = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        await apiClient.post('/auth/logout', {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
                'Authorization': `Bearer ${token}`,
            }
        }
        );
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const refreshUserSession = async () => {
    try {
        const response = await apiClient.post('/refresh-session');
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

// Управление задачами
export const getTasks = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('/tasks', {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const getTaskById = async (taskId) => {
    try {
        const response = await apiClient.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const createTask = async (taskData) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.post('/tasks', taskData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data.data)
        return response.data.data; // Возвращаем данные задачи
    } catch (error) {
        console.error('Error response from server:', error.response); // Логируем ответ сервера
        throw error; // Передаем ошибку дальше для обработки
    }
};

export const updateTask = async (taskId, taskData) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.patch(`/tasks/${taskId}`, taskData, {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response);
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const deleteTask = async (taskId) => {
    const token = localStorage.getItem('accessToken');
    try {
        await apiClient.delete(`/tasks/${taskId}`, {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
                'Authorization': `Bearer ${token}`,
            }
        });
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const getTasksByStatus = async (status) => {
    try {
        const response = await apiClient.get('/tasks/status', { params: { status } });
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

export const getAllTasksForAdmin = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('/admin/report/summary', {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
                'Authorization': `Bearer ${token}`,
            }
        });
        // console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};


export const getAllUsers = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('/users', {
            headers: {
                'Content-Type': 'application/json', // Заголовок Content-Type
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data.data);
        return response.data.data.data;
    } catch (error) {
        throw error.response.data; // Возвращаем сообщение об ошибке
    }
};

// Получение пользователя по email
export const getUserByEmail = async (email) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get(`/users/${email}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Добавление нового пользователя
export const addUser = async (userData) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.post('/users', userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Обновление информации о пользователе
export const updateUser = async (userId, updatedData) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.put(`users/${userId}`, updatedData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Удаление пользователя
export const deleteUser = async (userId) => {
    const token = localStorage.getItem('accessToken');
    try {
        await apiClient.delete(`/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
    } catch (error) {
        throw error.response.data;
    }
};

// Функція перевірки, чи існує вже така пошта
export const checkEmailExists = async (email) => {
    try {
        const response = await apiClient.post('/auth/check-email', { email });
        
        if (response.status === 200 && response.data.exists) {
            return true; 
        }
        
        return false; 
    } catch (error) {
        console.error('Error checking email:', error);
        throw new Error('Error checking email');
    }
};

export const getAllTasksSummaryReport = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('admin/report/summary', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getTasksByDayReport = async (date) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('admin/report/day', {
            params: { date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export const getTasksByWeekReport = async (date) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('admin/report/week', {
            params: { date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export const getTasksByMonthReport = async (date) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('admin/report/month', {
            params: { date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


export const getTasksByHalfYearReport = async (date) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('admin/report/halfyear', {
            params: { date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getTasksByYearReport = async (date) => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await apiClient.get('admin/report/year', {
            params: { date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
