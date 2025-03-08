// MainPage.jsx
import React from 'react';
import styles from '../styles/MainPage.module.css';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    const handleMenuClick = () => {
        console.log('Menu button clicked');
        navigate('');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.menuButton} onClick={handleMenuClick} aria-label="Menu">
                    <div className={styles.menuIconLine}></div>
                    <div className={styles.menuIconLine}></div>
                </button>
                <h1 className={styles.logo}>fridgorithm</h1>
            </header>

            <main className={styles.mainContent}>
                {/*  Wrap the question in a container */}
                <div className={styles.questionContainer}>
                    <h2 className={styles.question}>What's in your fridge?</h2>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="What are we working with?"
                    />
                    <div className={styles.buttonContainer}>
                        <button className={styles.iconButton} aria-label="Voice Input">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-8c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V6zm6 5c0 2.21-1.79 4-4 4s-4-1.79-4-4H8c0 2.76 2.24 5 5 5s5-2.24 5-5h-2z" />
                            </svg>
                        </button>
                        <button className={styles.iconButton} aria-label="Submit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;