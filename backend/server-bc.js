'use strict';

require('dotenv').config();

// module dependencies

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');
const { ExpressAuth } = require('@auth/express');
const GitHub = require('@auth/express/providers/github');

// config

const app = express();
const port = process.env.PORT || 3000;
const store = new session.MemoryStore();

app.set('port', port);
app.set('trust proxy', true); // If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected (not sure if we need this)

// middleware

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production', // only secure in prod
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    saveUninitialized: false,
    resave: false,
    store,
  })
);
app.use(
  '/auth/*',
  ExpressAuth({
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    callbacks: {
      async session({ session, token, user }) {
        // add user ID to session
        session.user.id = user.id;
        return session;
      },
      async jwt({ token, user }) {
        // if user signed in, add id to token
        if (user) {
          token.id = user.id;
        }
        return token;
      },
    },
  })
);

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

// routes

// test API route
app.get('/api', (req, res) => {
  res.send('Hello World!');
});

// auth routes

// login route
app.get('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and password are required' });
  }

  // find user by email
  db.users.findByEmail(email, (err, user) => {
    // if error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
    // if user not found
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }
    // if user found & authenticated
    if (user.password === password) {
      // set session data
      req.session.authenticated = true;
      req.session.user = { id: user.id, email: user.email };

      return res
        .status(200)
        .json({ success: true, user: { id: user.id, email: user.email } });
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// sign up route
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  // form validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }
  // check if user already exists
  db.users.findByEmail(email, (err, user) => {
    // if error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
    // if user exists
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    }
    // create new user
    db.users.create({ name, email, password }, (err, newUser) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Could not create user' });
      }
      // set session data
      req.session.authenticated = true;
      req.session.user = { id: newUser.id, email: newUser.email };
      return res.status(201).json({
        success: true,
        user: { id: newUser.id, email: newUser.email },
      });
    });
  });
});

// Auth status endpoint
app.get('/api/auth/session', (req, res) => {
  if (req.session && req.session.authenticated && req.session.user) {
    return res.status(200).json({
      user: req.session.user,
      isLoggedIn: true,
    });
  }
  return res.status(200).json({
    user: null,
    isLoggedIn: false,
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  });
});

/* istanbul ignore next */
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
