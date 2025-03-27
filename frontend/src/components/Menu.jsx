import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Menu.module.css';

const Menu = ({ isOpen }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
      ref={menuRef}
    >
      <nav>
        <ul>
          <li
            onClick={() => handleNavigate('/mainpage')}
            className={styles.menuItem}
            style={{ transitionDelay: '0.1s' }}
          >
            Home
          </li>
          <li
            onClick={() => handleNavigate('/about')}
            className={styles.menuItem}
            style={{ transitionDelay: '0.2s' }}
          >
            About
          </li>
          <li
            onClick={() => handleNavigate('/contact')}
            className={styles.menuItem}
            style={{ transitionDelay: '0.3s' }}
          >
            Contact
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
