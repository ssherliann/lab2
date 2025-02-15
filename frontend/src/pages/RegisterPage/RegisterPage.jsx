import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, checkEmailExists } from '../../api.js';  // Імпортуємо функцію checkEmailExists
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './RegisterPage.module.css';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

export default function RegisterPage() {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState(null);  // Стейт для зберігання помилки по email

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            console.log('Submitting:', values);
            try {
                const response = await registerUser({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                });
                console.log('User registered successfully:', response);
                navigate('/tasks');
            } catch (error) {
                console.error('Registration error:', error);
                setErrors({ general: error.response?.data?.message || error.message });
            }
        },
    });

    // Функція для перевірки існуючої пошти
    const handleEmailChange = async (e) => {
        const email = e.target.value;
        formik.handleChange(e); // Оновлення значення у Formik

        if (email) {
            try {
                const response = await checkEmailExists(email); // Викликаємо функцію для перевірки email
                if (response.exists) {
                    setEmailError('This email is already registered');
                } else {
                    setEmailError(null);
                }
            } catch (error) {
                console.error('Email check error:', error);
                setEmailError('Error checking email availability');
            }
        } else {
            setEmailError(null);
        }
    };

    return (
        <div className={styles.registerPage}>
            <div className={styles.container}>
                <h2 className={styles.title}>Register</h2>
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            className={styles.inputRegister}
                            id="name"
                            name="name"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                        {formik.touched.name && formik.errors.name ? <div className={styles.error}>{formik.errors.name}</div> : null}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            className={styles.inputRegister}
                            id="email"
                            name="email"
                            type="email"
                            onChange={handleEmailChange}  // Оновлений обробник для зміни email
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {/* Виводимо помилку, якщо email вже існує */}
                        {emailError && <div className={styles.emailError}>{emailError}</div>}
                        {formik.touched.email && formik.errors.email ? <div className={styles.error}>{formik.errors.email}</div> : null}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            className={styles.inputRegister}
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? <div className={styles.error}>{formik.errors.password}</div> : null}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className={styles.inputRegister}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className={styles.error}>{formik.errors.confirmPassword}</div> : null}
                    </div>
                    <button type="submit" className={styles.submitButton}>Register</button>
                    {formik.errors.general ? <div className={styles.error}>{formik.errors.general}</div> : null}
                </form>
            </div>
        </div>
    );
}
