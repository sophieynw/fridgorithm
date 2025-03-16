// routes/Speech.routes.js - Ensure no session requirement
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Token route - explicitly bypass authentication
router.get('/get-speech-token', async (req, res) => {
    // Indicate that this route is being called
    console.log('Speech token endpoint called');
    console.log('Session exists:', !!req.session);
    console.log('User authenticated:', req.session?.authenticated);

    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    console.log('Speech credentials:', {
        keyExists: !!speechKey,
        region: speechRegion
    });

    if (!speechKey || !speechRegion) {
        return res.status(400).json({
            error: 'Speech service credentials not configured'
        });
    }

    try {
        const tokenEndpoint = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

        console.log(`Requesting token from: ${tokenEndpoint}`);

        const response = await axios.post(tokenEndpoint, null, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/json'
            }
        });

        console.log('Token received successfully');

        // Send back the token and region
        res.json({
            token: response.data,
            region: speechRegion
        });
    } catch (error) {
        console.error('Token request failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }

        res.status(401).json({
            error: 'Failed to get token',
            details: error.message
        });
    }
});

module.exports = router;
