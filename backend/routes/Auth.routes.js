const express = require('express');
const router = express.Router();
const db = require('../db/db');

// signup route
router.post('/signup', (req, res) => {
  try {
    const { name, email, password } = req.body; // from front-end
    // const { name, email, password } = req.query; // from postman

    // input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // check if user exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use',
      });
    }

    // create user
    const result = db.addUser(name, email, password);

    // set up session for auto login
    req.session.authenticated = true;
    req.session.user = {
      id: result.lastInsertRowid,
      name,
      email,
    };

    // return success with user data
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: result.lastInsertRowid,
        name,
        email,
      },
    });
  } catch (error) {
    console.error('Signup error: ', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
    });
  }
});

// login route
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body; // from front-end
    // const { email, password } = req.query; // from postman

    // input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // check if user exists
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist',
      });
    }

    // check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Password incorrect',
      });
    }

    // set up session
    req.session.authenticated = true;
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // return success with user data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error: ', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occured',
    });
  }
});

// logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
    }

    res.clearCookie('connect.sid');
    return res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });
});

// session route to check if user is logged in
router.get('/session', (req, res) => {
  if (req.session.authenticated && req.session.user) {
    return res.json({
      isLoggedIn: true,
      user: req.session.user,
    });
  }

  return res.json({
    isLoggedIn: false,
  });
});

module.exports = router;
