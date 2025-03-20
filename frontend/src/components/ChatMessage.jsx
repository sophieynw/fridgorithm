import React from 'react';
import styles from '../styles/ChatMessage.module.css';

const ChatMessage = ({ message }) => {
  // Determine if the message is from the user or the AI
  const messageClass = message.sender === 'user' ? styles.userMessage : styles.aiMessage;

  return (
    <div className={`${styles.messageContainer} ${messageClass}`}>
      <p className={styles.messageText}>{message.text}</p>
    </div>
  );
};

export default ChatMessage;