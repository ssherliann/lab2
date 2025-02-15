import { useEffect, useState } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../api.js'; 
import User from '../User/User.jsx';
import styles from './AdminUsersList.module.css';
import { useNavigate } from 'react-router-dom';

export default function AdminUsersList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData); 
            } catch (err) {
                setError(err);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdateUser = async (updatedUser) => {
        const { _id, name, email, role } = updatedUser; 
        const userToUpdate = { name, email, role };
    
        try {
            await updateUser(_id, userToUpdate); 
            setUsers(users.map(user => (user._id === _id ? { ...user, ...userToUpdate } : user)));
            setIsModalOpen(false);
            setUserToUpdate(null);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };
    

    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id); 
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleOpenModal = (user) => {
        setUserToUpdate(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserToUpdate(null);
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (userToUpdate) {
            console.log(userToUpdate)
            handleUpdateUser(userToUpdate);
        }
    };


    return (
        <>
        <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
        <div className={styles.adminUsersList}>
            {error && <p className={styles.error}>{error.message}</p>}
            {users.map((user, index) => (
                <User
                    key={user.id || index} 
                    user={user}
                    onUpdate={handleOpenModal}
                    onDelete={handleDeleteUser}
                />
            ))}

            {isModalOpen && (
                <>
                    <div className={styles.modalBackdrop} onClick={closeModal}></div>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Edit User</h2>
                            <form onSubmit={handleModalSubmit}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={userToUpdate?.name || ''}
                                    onChange={(e) =>
                                        setUserToUpdate({ ...userToUpdate, name: e.target.value })
                                    }
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={userToUpdate?.email || ''}
                                    onChange={(e) =>
                                        setUserToUpdate({ ...userToUpdate, email: e.target.value })
                                    }
                                />
                                <input
                                    type="role"
                                    placeholder="Role"
                                    value={userToUpdate?.role || ''}
                                    onChange={(e) =>
                                        setUserToUpdate({ ...userToUpdate, role: e.target.value })
                                    }
                                />
                                <button type="submit">Update User</button>
                                <button type="button" onClick={closeModal}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
        </>
    );
}
