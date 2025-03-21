const express = require('express');
const router = express.Router();
const { AzureOpenAI } = require("openai");

// Initialize Azure OpenAI client
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://vongh-m8i301vf-eastus2.openai.azure.com/";
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o-mini";

const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

// POST endpoint to process chat requests
router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const result = await client.chat.completions.create({
            messages: messages,
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: null
        });

        res.json({ response: result.choices[0].message });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

module.exports = router;
