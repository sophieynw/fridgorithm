// routes/Vision.routes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { setupVisionAI } = require('../config/vision');
const { setupTrainingClient } = require('../config/vision');

const trainingClient = setupTrainingClient();
const projectId = process.env.AZURE_VISION_PROJECTID;

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

    /**
     * result.predictions returns array of indices : { probability, tagId }
     */
    const result = await client.detectImage(
      projectId,
      'Iteration5',
      req.file.buffer
    );

    const tags = await trainingClient.getTags(projectId);
    const tagMap = {};
    tags.forEach((tag) => {
      tagMap[tag.id] = tag.name;
    });

    const predictions = result.predictions || [];
    /**
     * returns unique list of items with probability threshold > 50%
     */
    const tagNames = [
      ...new Set(
        predictions
          .filter((p) => p.probability > 0.5)
          .map((p) => tagMap[p.tagId] || 'Unknown')
      ),
    ];

    return res.json({ tags: tagNames });
  } catch (error) {
    console.error('Error in analyze route:', error);
    return res.status(500).json({
      error: 'Failed to process image analysis',
      details: error.message,
    });
  }
});

module.exports = router;
