const {
  PredictionAPIClient,
} = require('@azure/cognitiveservices-customvision-prediction');
const {
  TrainingAPIClient,
} = require('@azure/cognitiveservices-customvision-training');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');

function setupVisionAI() {
  const predictionEndpoint = process.env.AZURE_PREDICTION_ENDPOINT;
  const predictionKey = process.env.AZURE_PREDICTION_KEY;

  if (!predictionEndpoint || !predictionKey) {
    console.error(
      'Azure Vision credentials not found in environment variables'
    );
    return null;
  }

  try {
    const credentials = new ApiKeyCredentials({
      inHeader: { 'Prediction-key': predictionKey },
    });
    const client = new PredictionAPIClient(credentials, predictionEndpoint);
    return client;
  } catch (error) {
    console.error('Error initializing Azure Vision client: ', error);
    return null;
  }
}

function setupTrainingClient() {
  const trainingEndpoint = process.env.AZURE_TRAINING_ENDPOINT;
  const trainingKey = process.env.AZURE_TRAINING_KEY;

  if (!trainingEndpoint || !trainingKey) {
    console.error(
      'Azure Training credentials not found in environment variables'
    );
    return null;
  }

  try {
    const credentials = new ApiKeyCredentials({
      inHeader: { 'Training-key': trainingKey },
    });
    const client = new TrainingAPIClient(credentials, trainingEndpoint);
    return client;
  } catch (error) {
    console.error('Error initializing Azure Vision Training client: ', error);
    return null;
  }
}

module.exports = { setupVisionAI, setupTrainingClient };

// references:
// https://www.npmjs.com/package/@azure/cognitiveservices-customvision-prediction?activeTab=readme
