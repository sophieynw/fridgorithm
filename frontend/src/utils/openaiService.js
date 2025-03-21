import axios from 'axios';

export const sendMessageToOpenAI = async (messages) => {
    try {
        const response = await axios.post('/api/openai/chat', { messages });
        return response.data.response;
    } catch (error) {
        console.error('Error sending message to OpenAI:', error);

        const errorMessage = error.response?.data?.error || 'Failed to get response from AI';
        throw new Error(errorMessage);
    }
};