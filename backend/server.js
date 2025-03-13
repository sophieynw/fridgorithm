'use strict';

require('dotenv').config();

// module dependencies

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

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
app.use(passport.initialize());
app.use(passport.session());

// routes
const authRoutes = require('./routes/Auth.routes');
app.use('/api/auth', authRoutes);

/* istanbul ignore next */
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
