import React from 'react';
import styles from '../styles/LogoutButton.module.css'; // Separate CSS Module
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear authentication-related data (e.g., tokens, user info)
    localStorage.removeItem('authToken'); // Example: Remove token from localStorage

    // 2. Redirect to the login page 
    navigate('/login'); 
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout} aria-label="Logout">
      <FontAwesomeIcon icon={faSignOutAlt} /> 
      <span className={styles.buttonText}>Log out</span>
    </button>
  );
};

export default LogoutButton;