const createImageAnalysisClient =
  require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');

function setupVisionAI() {
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;

  if (!endpoint || !key) {
    console.error(
      'Azure Vision credentials not found in environment variables'
    );
    return null;
  }

  try {
    const credential = new AzureKeyCredential(key);
    const client = createImageAnalysisClient(endpoint, credential);
    return client;
  } catch (error) {
    console.error('Error initializing Azure Vision client:', error);
    return null;
  }
}

module.exports = setupVisionAI;
