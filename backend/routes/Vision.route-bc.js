// routes/Vision.routes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const setupVisionAI = require('../config/vision');

// Add a test route
router.get('/test', (req, res) => {
  res.json({ message: 'Vision routes are working!' });
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// Route to handle image upload and analysis
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

    // Using the REST client properly with the Image Analysis API
    try {
      // Note: We're using client.path instead of new ImageAnalysisClient
      const analyzeResponse = await client.path('/imageanalysis:analyze').post({
        body: req.file.buffer,
        contentType: 'application/octet-stream',
        headers: {
          'Prediction-Key': process.env.AZURE_VISION_KEY
        }
        queryParameters: {
          features: 'tags',
          'model-version': 'latest',
        },
      });

      if (!analyzeResponse.body || !analyzeResponse.body.tags) {
        console.error('Unexpected response format:', analyzeResponse);
        return res.status(500).json({
          error: 'Unexpected response format from Azure Vision API',
        });
      }

      // Extract tags from the response
      const tags = analyzeResponse.body.tags.map((tag) => ({
        name: tag.name,
        confidence: tag.confidence,
      }));

      console.log('Detected tags:', tags);

      return res.json({
        success: true,
        tags: tags,
      });
    } catch (apiError) {
      console.error('API call failed:', apiError);

      // Handle specific API errors if available
      if (apiError.response) {
        console.error('API Error Response:', {
          status: apiError.response.status,
          message:
            apiError.response.data?.error?.message || 'Unknown API error',
        });
      }

      return res.status(500).json({
        error: 'Azure Vision API error',
        details: apiError.message,
      });
    }
  } catch (error) {
    console.error('Error in analyze route:', error);
    return res.status(500).json({
      error: 'Failed to process image analysis',
      details: error.message,
    });
  }
});

module.exports = router;
