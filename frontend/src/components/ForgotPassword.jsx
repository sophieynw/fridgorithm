// ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSend = (event) => {
        event.preventDefault();

        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        // Simulate sending a password reset email (replace with actual API call)
        console.log('Sending password reset email to:', email);

        alert('Password reset email sent!  (Simulated)'); 
        navigate('/login'); 
    };
    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>forgot password</h1>
                <form className={styles.form} onSubmit={handleSend}>
                    <label className={styles.label} htmlFor="email">EMAIL</label>
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@gmail.com"
                    />

                    <button className={styles.button} type="submit">send</button>
                </form>
                <p className={styles.signUpLink}>
                    don't have an account? <span className={styles.link} onClick={handleSignUpClick}>sign up here</span>.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;