import { logoutUser } from '../../api.js'; // Импортируем функцию logoutUser
import styles from './Header.module.css'; // Импортируем стили из CSS-модуля

// Обработчик выхода
const handleLogout = async () => {
    try {
        await logoutUser(); // Вызов функции выхода
        localStorage.removeItem('accessToken'); // Удаляем токен из localStorage
        window.location.href = '/'; // Редирект на страницу входа
        console.log('User logged out');
    } catch (error) {
        console.error('Logout error:', error); // Логируем ошибку
        alert('Failed to log out. Please try again.'); // Уведомляем пользователя
    }
};

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>TaskManager</h1>
            <button className={styles.buttonLogOut} onClick={handleLogout}>
                Log Out
            </button>
        </header>
    );
}
