import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../api.js'; 
import { useNavigate } from 'react-router-dom'; 
import styles from './LoginForm.module.css';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function LoginForm() {
    const navigate = useNavigate(); 

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            console.log('Submitting login:', values); 
            try {
                const response = await loginUser({
                    email: values.email,
                    password: values.password,
                });

                const userRole = response.data.role;
                console.log(userRole) 
                if (userRole === 'admin') {
                    navigate('/admin'); 
                } else if (userRole === 'employee') {
                    navigate('/tasks'); 
                } else {
                    setErrors({ general: 'Unknown role' }); 
                }
            } catch (error) {
                console.error('Login error:', error); 
                setErrors({ general: error.response?.data?.message || error.message });
            }
        },
    });

    return (
        <form className={styles.form} onSubmit={formik.handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? <div className={styles.error}>{formik.errors.email}</div> : null}
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? <div className={styles.error}>{formik.errors.password}</div> : null}
            </div>
            <button type="submit" className={styles.submitButton}>Login</button>
            {formik.errors.general ? <div className={styles.error}>{formik.errors.general}</div> : null}
        </form>
    );
}
