const express = require('express');
const authRoutes = require('./Auth.routes');
const speechRoutes = require('./Speech.routes');
const visionRoutes = require('./Vision.routes');

function setupRoutes(app) {
  // Session-free routes for speech services
  const speechRoutes = require('./Speech.routes');
  app.use('/api/speech', speechRoutes);
  app.use('/api/vision', visionRoutes);

  // Routes requiring session/authentication
  const authMiddleware = (req, res, next) => {
    if (!req.session.authenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

  // Auth routes (no middleware needed)
  const authRoutes = require('./Auth.routes');
  app.use('/api/auth', authRoutes);

  // Protected routes
  app.use('/api/protected', authMiddleware, (req, res) => {
    res.json({ success: true, message: 'This is a protected route' });
  });

  // Test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
}

module.exports = setupRoutes;
