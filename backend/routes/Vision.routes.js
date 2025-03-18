// routes/Vision.routes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const setupVisionAI = require('../config/vision');

router.get('/test', (req, res) => {
  res.json({ message: 'Vision routes are working!' });
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const client = setupVisionAI();
    if (!client) {
      return res.status(500).json({ error: 'Vision AI client not available' });
    }

    console.log('Analyzing image...', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Send the image for analysis using the REST API approach
    const response = await client.path('/imageanalysis:analyze').post({
      body: req.file.buffer, // Send the binary image buffer
      headers: {
        'Content-Type': req.file.mimetype, // Ensure correct MIME type
      },
      queryParameters: {
        features: 'tags', // Specify the analysis feature(s)
      },
    });

    if (response.status !== '200') {
      throw new Error(`Vision AI request failed: ${response.statusText}`);
    }

    const result = response.body;

    // Extract tags if available
    const tags =
      result.tagsResult?.values?.map((tag) => ({
        name: tag.name,
        confidence: tag.confidence,
      })) || [];

    console.log('Detected tags:', tags);

    return res.json({
      success: true,
      tags: tags,
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({
      error: 'Failed to analyze image',
      details: error.message,
    });
  }
});

module.exports = router;
