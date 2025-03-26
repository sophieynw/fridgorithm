import React, { useState } from 'react';
import styles from '../styles/MainPage.module.css'; 
import contactStyles from '../styles/Contact.module.css'; 
import MenuButton from './MenuButton'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faLaptopCode } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from './LogoutButton';

const Contact = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Developer data 
    const developers = [
        {
            name: 'Sophie Wang',
            image: './images/sophie.png', 
            github: 'https://github.com/sophieynw', 
            linkedin: 'https://linkedin.com/in/sophie-y-wang', 
            portfolio: 'https://sophieynw-portfolio.vercel.app/', 
        },
        {
            name: 'Grant Okawa',
            image: './images/grant.jpg', 
            github: 'https://github.com/GrantOkawa', 
            linkedin: 'https://www.linkedin.com/in/grantokawa/', 
        },
        {
            name: 'Nghi Lam Vo',
            image: './images/lam.jpg', 
            github: 'https://github.com/maxins1211', 
            linkedin: 'https://www.linkedin.com/in/nghi-lam-vo/', 
        },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <MenuButton onClick={handleMenuClick} isOpen={isMenuOpen} ariaLabel="Toggle Menu" />
                <h1 className={styles.logo}>fridgorithm</h1>
                <LogoutButton />
            </header>
            <main className={contactStyles.mainContent}>
              <div className={contactStyles.contactContainer}>
                <h2 className={styles.question}>Contact Us</h2>
                <div className={contactStyles.developers}>
                    {developers.map((dev, index) => (
                        <div key={index} className={contactStyles.developerCard}>
                            <img src={dev.image} alt={dev.name} className={contactStyles.profileImage} />
                            <h3>{dev.name}</h3>
                            <div className={contactStyles.links}>
                                <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                    <FontAwesomeIcon icon={faGithub} size="2x"/>
                                </a>
                                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <FontAwesomeIcon icon={faLinkedin} size="2x"/>
                                </a>
                              {dev.portfolio && <a href={dev.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Portfolio">
                                    <FontAwesomeIcon icon={faLaptopCode} size="2x"/>
                                </a>}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </main>
        </div>
    );
};

export default Contact;