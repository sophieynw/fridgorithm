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

        // In a real application, you would:
        // 1. Send a request to your backend to generate a password reset token.
        // 2. Send an email to the user with a link containing the token.
        // 3. The link would lead to a page where the user can set a new password.

        // For this example, we'll just navigate to a confirmation page (you could
        // create a separate "PasswordResetSent.jsx" component).
        // Or, even better, show a success message on the *same* page, without navigating.
        alert('Password reset email sent!  (Simulated)'); // Show success to the user.
        navigate('/login'); // Redirect user.  Consider keeping them on this page.
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