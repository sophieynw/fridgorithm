import React, { useState } from 'react';
import styles from '../styles/MainPage.module.css'; 
import MenuButton from './MenuButton'; 

const About = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <MenuButton onClick={handleMenuClick} isOpen={isMenuOpen} ariaLabel="Toggle Menu" />
                <h1 className={styles.logo}>fridgorithm</h1>
            </header>
            <main className={styles.mainContent}>
                <div className={styles.questionContainer}>
                    <h2 className={styles.question}>Fridgorithm</h2>
                    <p>
                        Fridgorithm is an innovative app designed to help you make the most of
                        the ingredients you have on hand. Simply tell us what's in your fridge
                        — by voice, by taking a picture, or by typing — and our AI-powered
                        system will suggest delicious recipes you can create. No more food
                        waste, and no more staring blankly into your refrigerator!
                    </p>
                </div>
            </main>
        </div>
    );
};

export default About;