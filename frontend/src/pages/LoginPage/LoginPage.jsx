import LoginForm from '../../components/LoginForm/LoginForm.jsx'; // Импортируем компонент LoginForm
import styles from './LoginPage.module.css'; // Импортируем стили из CSS-модуля

export default function LoginPage() {
    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>
                <h2 className={styles.title}>Login</h2>
                <LoginForm /> 
            </div>
        </div>
    );
}
