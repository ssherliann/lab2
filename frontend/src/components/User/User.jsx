import styles from './User.module.css';

export default function User({ user, onUpdate, onDelete }) {
    return (
        <div className={styles.userContainer}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <button onClick={() => onUpdate(user)}>Update an user</button>
            <button onClick={() => onDelete(user._id)} className={styles.deleteButton}>Delete an user</button>
        </div>
    );
}
