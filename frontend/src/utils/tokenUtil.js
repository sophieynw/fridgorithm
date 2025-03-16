import axios from 'axios';
import Cookies from 'universal-cookie';

export async function getTokenOrRefresh() {
    const cookies = new Cookies();
    const speechToken = cookies.get('speech-token');

    console.log('Starting token fetch process');
    console.log('Existing cookie token:', speechToken ? 'exists' : 'not found');

    if (speechToken === undefined) {
        try {
            console.log('No token in cookie, calling API endpoint...');

            // Important: withCredentials: false to avoid sending session cookies
            const response = await axios.get('/api/speech/get-speech-token', {
                withCredentials: false, // Avoid sending session cookies
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            console.log('API response status:', response.status);
            console.log('API response data:', response.data);

            if (!response.data || !response.data.token || !response.data.region) {
                console.error('Invalid token response:', response.data);
                return { authToken: null, region: null, error: 'Invalid token response' };
            }

            const token = response.data.token;
            const region = response.data.region;

            // Store in cookie
            cookies.set('speech-token', region + ':' + token, { path: '/' });

            return { authToken: token, region: region };
        } catch (err) {
            console.error('Error fetching token:', err);
            return {
                authToken: null,
                region: null,
                error: err.response?.data?.error || err.message
            };
        }
    } else {
        const idx = speechToken.indexOf(':');
        const region = speechToken.slice(0, idx);
        const token = speechToken.slice(idx + 1);

        return { authToken: token, region: region };
    }
}
