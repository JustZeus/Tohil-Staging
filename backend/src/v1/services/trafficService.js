const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const HERE_API_KEY = process.env.HERE_API_KEY;
const INCIDENTS_V7_URL = 'https://data.traffic.hereapi.com/v7/incidents';

/**
 * Fetch traffic incidents using HERE API v7 and telemetry input
 * @param {Array<{lat: number, lon: number, locationName?: string}>} telemetryPoints
 * @returns {Promise<Array<Object>>}
 */
async function fetchTrafficIncidentsFromTelemetryPoints(telemetryPoints, radius="2000") {
  const allIncidents = [];

  for (const point of telemetryPoints) {
    const { lat, lon, locationName = `${lat},${lon}` } = point;

    try {
      const response = await axios.get(INCIDENTS_V7_URL, {
        params: {
          in: `circle:${lat},${lon};r=${radius}`,
          locationReferencing: 'olr',
          apiKey: HERE_API_KEY
        }
      });

      console.log(`\n[HERE Raw v7] Incidents at (${lat}, ${lon}):`);
      

      const results = response.data?.results;
      if (!Array.isArray(results)) {
        console.warn(`[HERE Incidents v7] No incidents found near ${locationName}`);
        continue;
      }

      const parsed = results.map(r => {
        const d = r.incidentDetails;
        return {
          id: d.id,
          type: d.type,
          criticality: d.criticality,
          summary: d.summary?.value,
          description: d.description?.value,
          roadClosed: d.roadClosed,
          startTime: d.startTime,
          endTime: d.endTime,
          locationName,
          olr: r.location?.olr,
          lengthMeters: r.location?.length ?? null,
          language: d.summary?.language
        };
      });

      allIncidents.push(...parsed);
    } catch (err) {
      const errorMsg = err.response?.data?.title || err.message;
      console.error(`[HERE Incidents v7] Error at (${lat}, ${lon}): ${errorMsg}`);
    }
  }

  return allIncidents;
}

module.exports = {
  fetchTrafficIncidentsFromTelemetryPoints
};