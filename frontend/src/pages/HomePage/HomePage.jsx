import { Link } from 'react-router-dom'
import styles from  './HomePage.module.css'

export default function HomePage() {
    return(
        <div className={styles.container}>
            <div className={styles.welcomeText}>
                <h1>Welcome to Task Manager app!</h1>
                <p>This web application is designed for your company to enhance task management and team collaboration. Our platform helps you and your team stay organized and productive by allowing you to create, assign, and track tasks efficiently.</p>
                <p>With features that enable you to set priorities and monitor deadlines, you can ensure that everything stays on track. Team members can easily update their progress, while managers can oversee workflows and coordinate efforts across departments. Whether you’re handling projects or managing daily operations, this tool simplifies the process.</p>
                <p>If you have any questions or need assistance, our support team is here to help!</p>
            </div>
            <div className={styles.autorizationMenu}>
                <p>To use this web application, please log in to your account. Authorization is required to access all features and ensure the security of your data.</p>
                <p>If you don’t have an account yet, you can easily sign up to get started.</p>
                <p style={{ textAlign: "center" }}>Thank you for using our Task Manager app!</p>
                <div className={styles.autorizationButtons}>
                    <Link to='/register'>
                        <button className={styles.autorizationButtonRegister}>
                            Register
                        </button>
                    </Link>
                    <Link to='login'>
                        <button className={styles.autorizationButtonLogin}>
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}