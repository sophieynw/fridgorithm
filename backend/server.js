'use strict';

require('dotenv').config();

// module dependencies

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const db = require('./db/db');
const LocalStrategy = require('passport-local').Strategy;

// config

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.set('trust proxy', true); // If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected (not sure if we need this)

// middleware

const corsOptions = {
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// For debugging - log all incoming requests with more detail
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   console.log('Headers:', JSON.stringify(req.headers, null, 2));
//   console.log('Query params:', req.query);
//   console.log(
//     'Body type:',
//     typeof req.body,
//     Array.isArray(req.body) ? 'array' : 'not array'
//   );
//   console.log('Body content:', req.body);
//   console.log('Raw body:', req.rawBody);
//   next();
// });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);
app.use(passport.session());

// routes

// test api
app.get('/api/test', (req, res) => {
  res.send('Hello world!');
});

// signup route
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body; // from front-end
    // const { name, email, password } = req.query; // from postman

    // input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        received: {
          name: !!name,
          email: !!email,
          password: !!password,
          body: req.body,
          query: req.query,
        },
        tip: 'Make sure to send as JSON body with Content-Type: application/json',
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
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred',
    });
  }
});

/* istanbul ignore next */
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
