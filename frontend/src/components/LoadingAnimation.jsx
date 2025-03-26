import React from 'react';
import styles from '../styles/MainPage.module.css';

// Image Analysis Loading Component
export const ImageAnalyzing = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.imageAnalysisAnimation}>
        <div className={styles.imageFrame}></div>
        <div className={styles.scanLine}></div>
        <div className={styles.cornerTL}></div>
        <div className={styles.cornerTR}></div>
        <div className={styles.cornerBL}></div>
        <div className={styles.cornerBR}></div>
      </div>
      <div className={styles.loadingText}>Analyzing image</div>
    </div>
  );
};

// Thinking Loading Component
export const Thinking = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.thinkingAnimation}>
        <div className={styles.brain}>
          <div className={styles.brainPath}></div>
          <div className={styles.brainPath}></div>
          <div className={styles.brainPath}></div>
          <div className={styles.thoughtBubbles}>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
            <div className={styles.bubble}></div>
          </div>
        </div>
      </div>
      <div className={styles.loadingText}>Thinking</div>
    </div>
  );
};

// Generic Loading Component with custom message
export const Loading = ({ message = 'Loading' }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.thinkingAnimation}>
        <div className={styles.brain}>
          <div className={styles.brainPath}></div>
          <div className={styles.brainPath}></div>
          <div className={styles.brainPath}></div>
        </div>
      </div>
      <div className={styles.loadingText}>{message}</div>
    </div>
  );
};
