// SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignUp.module.css'; // Import the CSS Module

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Basic validation (you'll want more robust validation in a real app)
        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Here you would typically make an API call to your backend
        // to create the new user.  For this example, we'll just log the data
        // and navigate to the login page.
        console.log('Signing up:', { name, email, password });

        // In a real app, after successful signup, you might automatically log the user in
        // or redirect them to a confirmation page.  For simplicity, we go to login.
        navigate('/login');
    };

    const handleLoginLinkClick = () => {
        navigate('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>create a new account</h1>
                <form className={styles.form} onSubmit={handleSignUp}>
                    <label className={styles.label} htmlFor="name">NAME</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="jane smith"
                    />

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

                    <button className={styles.button} type="submit">sign up</button>
                </form>
                <p className={styles.loginLink}>
                    have an account? <span className={styles.link} onClick={handleLoginLinkClick}>log in here</span>.
                </p>
            </div>
        </div>
    );
};

export default SignUp;