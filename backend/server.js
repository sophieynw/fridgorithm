'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const setupSession = require('./config/session');
const setupRoutes = require('./routes');

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.set('trust proxy', true);

// Middleware
const corsOptions = { credentials: true };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session
setupSession(app);

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
setupRoutes(app);

/* istanbul ignore next */
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});