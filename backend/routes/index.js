const express = require('express');
const authRoutes = require('./Auth.routes');
const speechRoutes = require('./Speech.routes');
const visionRoutes = require('./Vision.routes');
const openAIRoutes = require('./OpenAI.routes');

function setupRoutes(app) {
  // Session-free routes
  app.use('/api/speech', speechRoutes);
  app.use('/api/vision', visionRoutes);
  app.use('/api/openai', openAIRoutes);

  // Auth routes (no middleware needed)
  app.use('/api/auth', authRoutes);

  // Auth middleware
  const authMiddleware = (req, res, next) => {
    if (!req.session.authenticated) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

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
