import React from 'react';
import styles from '../styles/ChatMessage.module.css';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  // Custom components for ReactMarkdown
  // const components = {
  //   p: ({ node, ...props }) => <p className={styles.paragraph} {...props} />,
  //   ul: ({ node, ...props }) => (
  //     <ul className={styles.unorderedList} {...props} />
  //   ),
  //   ol: ({ node, ...props }) => (
  //     <ol className={styles.orderedList} {...props} />
  //   ),
  //   li: ({ node, ...props }) => <li className={styles.listItem} {...props} />,
  //   strong: ({ node, ...props }) => (
  //     <strong className={styles.bold} {...props} />
  //   ),
  //   em: ({ node, ...props }) => <em className={styles.italic} {...props} />,
  //   h1: ({ node, ...props }) => <h1 className={styles.heading1} {...props} />,
  //   h2: ({ node, ...props }) => <h2 className={styles.heading2} {...props} />,
  //   h3: ({ node, ...props }) => <h3 className={styles.heading3} {...props} />,
  // };

  return (
    <div
      className={`${styles.messageContainer} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      <div className={styles.messageContent}>
        {isUser ? (
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
