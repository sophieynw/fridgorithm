import React, { useState } from 'react';
import styles from '../styles/MainPage.module.css';
import aboutStyles from '../styles/About.module.css';
import MenuButton from './MenuButton';
import {
  CameraIcon,
  MicrophoneIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import LogoutButton from './LogoutButton';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <MenuButton
          onClick={handleMenuClick}
          isOpen={isMenuOpen}
          ariaLabel="Toggle Menu"
        />
        <h1 className={styles.logo}>fridgorithm</h1>
        <LogoutButton />
      </header>
      <main className={styles.mainContent}>
        <div className={aboutStyles.aboutContainer}>
          <div className={styles.heroSection}>
            <div className={styles.heroText}>
              <h2 className={styles.heroTitle}>Transform Your Fridge</h2>
              <p className={styles.heroSubtitle}>
                From ingredients to meals in seconds
              </p>
            </div>
            <div className={styles.heroIllustration}>
              <div className={styles.fridgeContainer}>
                <div className={styles.fridgeDoor}>
                  <div className={styles.fridgeShelves}>
                    <div className={styles.shelf}>
                      <span
                        className={styles.ingredient}
                        style={{ animationDelay: '0.5s' }}
                      >
                        🥚
                      </span>
                      <span
                        className={styles.ingredient}
                        style={{ animationDelay: '0.7s' }}
                      >
                        🥛
                      </span>
                      <span
                        className={styles.ingredient}
                        style={{ animationDelay: '0.7s' }}
                      >
                        🧀
                      </span>
                    </div>
                    <div className={styles.shelf}>
                      <span
                        className={styles.ingredient}
                        style={{ animationDelay: '0.9s' }}
                      >
                        🥦
                      </span>
                      <span
                        className={styles.ingredient}
                        style={{ animationDelay: '1.1s' }}
                      >
                        🍗
                      </span>
                      <span
                        className={styles.ingredient}
                        style={{ animationDelay: '1.1s' }}
                      >
                        🥑
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.recipeTransition}>
                  <div className={styles.arrow}></div>
                  <div className={styles.sparkles}></div>
                </div>
                <div className={styles.recipeCard}>
                  <span className={styles.recipeIcon}>📝</span>
                  <div className={styles.recipeText}>AI Recipe</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <CameraIcon className={styles.featureIcon} />
              <h3>Snap & Cook</h3>
              <p>Capture your ingredients and get instant recipe suggestions</p>
            </div>
            <div className={styles.featureCard}>
              <MicrophoneIcon className={styles.featureIcon} />
              <h3>Voice Input</h3>
              <p>Just say what's in your fridge while your hands are busy</p>
            </div>
            <div className={styles.featureCard}>
              <ComputerDesktopIcon className={styles.featureIcon} />
              <h3>Type It Out</h3>
              <p>Quickly list ingredients and discover new combinations</p>
            </div>
          </div>

          <div className={styles.aboutText}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionBody}>
              Fridgorithm combines AI-powered analysis with culinary expertise
              to help you reduce food waste and discover delicious recipes. Our
              system understands ingredient combinations, dietary preferences,
              and cooking styles to provide personalized recommendations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
