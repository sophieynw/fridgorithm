import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import styles from '../styles/SignUp.module.css';

import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();

    // Basic validation

    if (!name || !email || !password) {
      alert('Please fill in all fields.');

      return;
    }

    // api call

    axios
      .post('http://localhost:3000/api/auth/signup', {
        name: name,

        email: email,

        password: password,
      })

      .then((response) => console.log(response.data))

      .catch((error) => console.error('Error: ', error.m));

    console.log('Signing up:', { name, email, password });

    navigate('/login');
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
            sign up
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
    </div>
  );
};
export default SignUp;
