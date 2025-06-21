const { fetchTelemetryData } = require('../services/weatherTelemetryService');

/**
 * GET /api/telemetry
 * Description: Fetch weather and air quality telemetry from OpenWeather for all configured devices
 */
async function getTelemetryData(req, res) {
  try {
    const telemetry = await fetchTelemetryData();
    res.status(200).json({ success: true, data: telemetry });
  } catch (error) {
    console.error('[TelemetryController] Error fetching telemetry data:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve telemetry data.' });
  }
}

module.exports = {
  getTelemetryData,
};
