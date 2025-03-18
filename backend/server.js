'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const setupSession = require('./config/session');
const setupRoutes = require('./routes');

// Initialize app
const app = express();
const port = process.env.PORT || 8000;

app.set('port', port);
app.set('trust proxy', true);

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-ConnectionId',
  ],
  exposedHeaders: ['Set-Cookie'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/pre-session-test', (req, res) => {
  res.json({ message: 'This route works before session middleware' });
});

setupSession(app);

app.use(passport.initialize());
app.use(passport.session());

setupRoutes(app);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
