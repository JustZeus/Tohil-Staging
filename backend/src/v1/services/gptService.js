const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT;

const GPT_SYSTEM_PROMPT = `
You are Tohil, an AI expert in wildfire prevention and emergency response. You:
- Analyze real-time telemetry and traffic data per location.
- Predict wildfire risks, potential spread, and impact severity.
- Recommend tailored actions for response teams and citizens.
- Provide short, actionable insights per site.

Be concise, risk-aware, and decision-oriented in each response, do not respond using markdown language. 
`;

/**
 * Sends a single location's telemetry + traffic info to the GPT model.
 * @param {Object} locationData
 * @returns {Promise<Object>} { locationName, recommendation }
 */
async function getInsightForLocation(locationData) {
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2025-01-01-preview`;

  const locationName = locationData.locationName || locationData.deviceId || 'Unknown Location';

  const messages = [
    {
      role: 'system',
      content: GPT_SYSTEM_PROMPT.trim()
    },
    {
      role: 'user',
      content: `Analyze this location:\n\n${JSON.stringify(locationData, null, 2)}`
    }
  ];

  try {
    const response = await axios.post(url, {
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_OPENAI_API_KEY
      }
    });

    const reply = response.data.choices?.[0]?.message?.content;

    return {
      location: locationName,
      recommendation: reply || 'No insight generated.'
    };

  } catch (error) {
    console.error(`[Tohil GPT Error] ${locationName}:`, error.response?.data || error.message);
    return {
      location: locationName,
      recommendation: 'Error generating insight for this location.'
    };
  }
}

/**
 * Iterates over all telemetry entries and gets insights per location.
 * @param {Array<Object>} combinedTelemetry
 * @returns {Promise<Array<{location: string, recommendation: string}>>}
 */
async function generateInsightsPerLocation(combinedTelemetry) {
  const results = [];

  for (const entry of combinedTelemetry) {
    const insight = await getInsightForLocation(entry);
    results.push(insight);
  }

  return results;
}

module.exports = {
  generateInsightsPerLocation
};