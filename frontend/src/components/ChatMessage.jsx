import React from 'react';
import styles from '../styles/ChatMessage.module.css';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`${styles.messageContainer} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      <div className={styles.messageContent}>
        {message.type === 'image' ? (
          <div className={styles.imageWrapper}>
            <img
              src={message.imageUrl}
              alt="Food in fridge"
              className={styles.uploadedImage}
            />
          </div>
        ) : isUser ? (
          <p>{message.text}</p>
        ) : (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
