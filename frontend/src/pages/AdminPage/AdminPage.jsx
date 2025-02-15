import { Link } from "react-router-dom";
import Header from '../../components/Header/Header.jsx';
import styles from "./AdminPage.module.css";

export default function AdminPage() {
    return (
        <>       
            <Header />
            <div className={styles.container}>
                <Link to="/admin/alltasks" className={styles.link}>To tasks</Link>
                <Link to="/admin/allusers" className={styles.link}>To users</Link>
                <Link to="/admin/reports" className={styles.link}>To reports</Link>
            </div>
        </>
    );
}