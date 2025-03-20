import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Menu.module.css'

const Menu = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  }

  if (!isOpen) return null;

  return (
    <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
      <nav>
        <ul>
          <li onClick={() => handleNavigate('/mainpage')} className={styles.menuItem}>Home</li>
          <li onClick={() => handleNavigate('/about')} className={styles.menuItem}>About</li> 
          <li onClick={() => handleNavigate('/contact')} className={styles.menuItem}>Contact</li> 
        </ul>
      </nav>
    </div>
  );
};

export default Menu;