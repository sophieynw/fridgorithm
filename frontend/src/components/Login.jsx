import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import styles from '../styles/Login.module.css';

import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert('Please enter both email and password.');

      return;
    }

    // api call

    axios
      .post(
        'http://localhost:3000/api/auth/login',
        {
          email: email,

          password: password,
        },
        { withCredentials: true }
      )

      .then((response) => {
        console.log(response.data);
        // this is for checking
        // console.log('Logging in:', { email, password });

        navigate('/mainpage');
      })

      .catch((error) => console.error('Error: ', error));
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgotpassword');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          hi jane,
          <br />
          welcome back!
        </h1>

        <form className={styles.form} onSubmit={handleLogin}>
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
          />

          <button className={styles.button} type="submit">
            log in
          </button>
        </form>

        <p
          className={styles.forgotPasswordLink}
          onClick={handleForgotPasswordClick}
        >
          forgot password?
        </p>

        <p className={styles.signUpLink}>
          don't have an account?{' '}
          <span className={styles.link} onClick={handleSignUpClick}>
            sign up here
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
