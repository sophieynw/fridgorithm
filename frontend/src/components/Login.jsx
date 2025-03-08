// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Import CSS Module

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Simulate login (replace with actual API call)
        console.log('Logging in:', { email, password });

        // In a real application, you would:
        // 1. Send a request to your backend to authenticate the user.
        // 2. If authentication is successful, store the user's token (e.g., JWT)
        //    in local storage or a cookie.
        // 3. Redirect the user to the main app page (e.g., a dashboard).

        // For this example, we'll just navigate to a placeholder "MainPage".
        navigate('/mainpage');
    };

    const handleForgotPasswordClick = () => {
        navigate('/forgotpassword');
    };

     const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>hi jane,<br />welcome back!</h1>
                <form className={styles.form} onSubmit={handleLogin}>
                    <label className={styles.label} htmlFor="email">EMAIL</label>
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@gmail.com"
                    />

                    <label className={styles.label} htmlFor="password">PASSWORD</label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                    />

                    <button className={styles.button} type="submit">log in</button>
                </form>
                <p className={styles.forgotPasswordLink} onClick={handleForgotPasswordClick}>
                  forgot password?
                </p>
                <p className={styles.signUpLink}>
                    don't have an account? <span className={styles.link}onClick={handleSignUpClick}>sign up here</span>.
                </p>
            </div>
        </div>
    );
};

export default Login;