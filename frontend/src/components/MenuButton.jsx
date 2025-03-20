import React from 'react';
import styles from '../styles/MenuButton.module.css';
import Menu from './Menu'


const MenuButton = ({ onClick, isOpen, ariaLabel = "Menu" }) => {
    return (
      <>
        <button
            className={`${styles.menuButton} ${isOpen ? styles.menuButtonOpen : ''}`}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
        >
            <div className={styles.menuIcon}>
                <div className={`${styles.menuIconLine} ${isOpen ? styles.menuIconLineTop : ''}`}></div>
                <div className={`${styles.menuIconLine} ${isOpen ? styles.menuIconLineMiddle : ''}`}></div>
                <div className={`${styles.menuIconLine} ${isOpen ? styles.menuIconLineBottom : ''}`}></div>
            </div>
        </button>
        <Menu isOpen={isOpen} />
      </>
    );
};

export default MenuButton;