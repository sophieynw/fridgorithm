const express = require('express');
const authRoutes = require('./Auth.routes');

function setupRoutes(app) {
    // Authentication routes
    app.use('/api/auth', authRoutes);
    //Can add more routes in future
}

module.exports = setupRoutes;