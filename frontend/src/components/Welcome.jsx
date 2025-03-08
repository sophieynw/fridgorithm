// Welcome.jsx
import React from 'react';
import styles from '../styles/Welcome.module.css';
import { useNavigate } from 'react-router-dom';


const Welcome = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleSignUpClick = () => {
        navigate('/signup'); 
    };


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.logo}>fridgorithm</h1>
                <button className={styles.button} onClick={handleLoginClick}>log in</button>
                <button className={styles.button} onClick={handleSignUpClick}>sign up</button>
            </div>
        </div>
    );
};

export default Welcome;