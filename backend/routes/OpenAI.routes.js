const express = require('express');
const router = express.Router();
const { AzureOpenAI } = require("openai");

// Initialize Azure OpenAI client
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://vongh-m8i301vf-eastus2.openai.azure.com/";
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o-mini";

const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    defaultDeployment: deployment
});

// POST endpoint to process chat requests
// Server-side API endpoint
router.post('/chat', async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
    }

    try {
        // Set a timeout for the OpenAI API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const response = await client.chat.completions.create({
            messages: messages,
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: null
        });

        clearTimeout(timeoutId);

        res.json({
            response: response.choices[0].message
        });
    } catch (error) {
        console.error('OpenAI API error:', error);

        let statusCode = 500;
        let errorMessage = 'Failed to generate response';

        if (error.name === 'AbortError') {
            statusCode = 408; // Request Timeout
            errorMessage = 'OpenAI API request timed out';
        } else if (error.response?.status === 429) {
            statusCode = 429;
            errorMessage = 'Rate limit exceeded';
        }

        res.status(statusCode).json({ error: errorMessage });
    }
});


module.exports = router;
