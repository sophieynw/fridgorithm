import axios from 'axios';

export const sendMessageToOpenAI = async (messages) => {
    try {
        console.log('Preparing to send messages to OpenAI API');

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages: must be a non-empty array');
        }

        // First, ensure each message has proper structure
        const validMessages = messages.filter(msg =>
            msg && msg.role && msg.content !== undefined &&
            ['system', 'user', 'assistant'].includes(msg.role)
        );

        // Then, remove consecutive repeated user messages (keep only the last one)
        // This prevents duplicated user inputs
        const cleanedMessages = [];
        for (let i = 0; i < validMessages.length; i++) {
            // Skip if this is a user message that repeats the previous one
            if (i > 0 &&
                validMessages[i].role === 'user' &&
                validMessages[i - 1].role === 'user' &&
                validMessages[i].content === validMessages[i - 1].content) {
                console.log('Skipping duplicated user message:', validMessages[i].content);
                continue;
            }

            // Also handle potential null/undefined content
            if (validMessages[i].content === null || validMessages[i].content === undefined) {
                validMessages[i].content = '';
            }

            cleanedMessages.push(validMessages[i]);
        }

        if (cleanedMessages.length === 0) {
            throw new Error('No valid messages after cleaning');
        }

        console.log('Sending messages to OpenAI:', cleanedMessages);

        // Add request timeout to prevent hanging requests
        const response = await axios.post('/api/openai/chat', {
            messages: cleanedMessages
        }, {
            timeout: 30000 // 30 second timeout
        });

        if (!response.data || !response.data.response) {
            console.error('Invalid response format from server:', response.data);
            throw new Error('Invalid response format');
        }

        return response.data.response;
    } catch (error) {
        console.error('Error sending message to OpenAI:', error);

        // Enhanced error handling with useful messages
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Status code:', error.response.status);

            // Format the error message from the server response
            const errorMessage = error.response.data?.error || 'Failed to process chat request';
            throw new Error(errorMessage);
        }

        // For network errors or other issues
        throw error;
    }
};

// In openaiService.js - create a specialized function for recipe requests
export const getAnotherRecipe = async (ingredients) => {
    try {
        // Simple and direct prompt for a new recipe
        const messages = [
            {
                role: 'system',
                content: 'You are a cooking assistant. Provide detailed recipes with ingredients lists and step-by-step instructions. Format using markdown.'
            },
            {
                role: 'user',
                content: `I have these ingredients: ${ingredients}. Please suggest a recipe I can make with them. Make it different from any common recipe you might typically suggest first.`
            }
        ];

        // Use a shorter timeout for this specialized function
        const response = await axios.post('/api/openai/chat', {
            messages
        }, {
            timeout: 10000000
        });

        return response.data.response;
    } catch (error) {
        console.error('Error getting recipe:', error);
        throw error;
    }
};
