import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignUp.module.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Detect if device is mobile for responsive positioning
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignUp = (event) => {
    event.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Basic validation
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.', {
        position: isMobile ? 'top-center' : 'top-right',
        autoClose: 3000,
        className: 'custom-toast-error',
      });
      return;
    }

    setIsSubmitting(true);

    // API call
    axios
      .post('http://localhost:3000/api/auth/signup', {
        name: name,
        email: email,
        password: password,
      })
      .then((response) => {
        // Show success toast
        toast.success('Account created successfully!', {
          position: isMobile ? 'top-center' : 'top-right',
          autoClose: 1000,
          className: 'custom-toast-success',
          onClose: () => {
            // Navigate only after the toast is closed or times out
            navigate('/login');
          },
        });

        console.log(response.data);
      })
      .catch((error) => {
        // Show error toast
        toast.error(
          error.response?.data?.message ||
            'Error creating account. Please try again.',
          {
            position: isMobile ? 'top-center' : 'top-right',
            autoClose: 3000,
            className: 'custom-toast-error',
          }
        );
        console.error('Error: ', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleLoginLinkClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>create a new account</h1>

        <form className={styles.form} onSubmit={handleSignUp}>
          <label className={styles.label} htmlFor="name">
            NAME
          </label>

          <input
            className={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="jane smith"
            required
          />

          <label className={styles.label} htmlFor="email">
            EMAIL
          </label>

          <input
            className={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@gmail.com"
            required
          />

          <label className={styles.label} htmlFor="password">
            PASSWORD
          </label>

          <input
            className={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            minLength="3"
          />

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'signing up...' : 'sign up'}
          </button>
        </form>

        <p className={styles.loginLink}>
          have an account?{' '}
          <span className={styles.link} onClick={handleLoginLinkClick}>
            log in here
          </span>
          .
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position={isMobile ? 'top-center' : 'top-right'}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
      />
    </div>
  );
};

export default SignUp;
