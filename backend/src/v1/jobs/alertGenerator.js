const cron = require('node-cron');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Alert = require('../database/alerts');
dotenv.config();

const { fetchTelemetryData } = require('../services/weatherTelemetryService');
const { generateInsightsPerLocation } = require('../services/gptService');
const {  fetchTrafficIncidentsFromTelemetryPoints} = require('../services/trafficService');

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomPolygon(centerLon, centerLat) {
  const offset = 0.0015;
  return [
    [centerLon, centerLat],
    [centerLon + offset, centerLat + offset],
    [centerLon + offset, centerLat - offset],
    [centerLon, centerLat]
  ];
}


async function generateOnceNow() {

  try {

    const telemetry = await fetchTelemetryData();
    const telemetryData = telemetry;
    const geoPoints = telemetry.map(d => ({
      lat: d.lat,
      lon: d.lon,
      locationName: d.locationName || d.deviceId
    }));

    const trafficIncidents = await fetchTrafficIncidentsFromTelemetryPoints(geoPoints);

    const incidentMap = {};
    for (const incident of trafficIncidents) {
      const key = `${incident.locationName}`;
      if (!incidentMap[key]) incidentMap[key] = [];
      incidentMap[key].push(incident);
    }

    const combined = telemetry.map(t => {
      const locationKey = t.locationName || t.deviceId;
      return {
        ...t,
        trafficIncidents: incidentMap[locationKey] || []
      };
    });

    const insights = await generateInsightsPerLocation(combined);

    for (let i = 0; i < telemetryData.length; i++) {
      const t = telemetryData[i];
      const rec = insights[i]?.recommendation || 'No recommendation available';

      const sectorId = `C${Math.floor(Math.random() * 9) + 1}`;
      const sectorName = `Sector ${sectorId} - ${t.locationName || 'Unknown Region'}`;

      const alertData = {
        alertId: `ALRT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
        title: getRandomFromArray([
          'Confirmed Wildfire Near Urban Area',
          'Elevated Risk Detected in Brush Zone',
          'Wind-Driven Fire Threat Identified'
        ]),
        severity: Math.floor(Math.random() * 4) + 1,
        sector: {
          id: sectorId,
          name: sectorName,
          polygon: {
            type: 'Polygon',
            coordinates: [generateRandomPolygon(t.lon, t.lat)]
          }
        },
        telemetry: {
          temperature: t.temperature,
          humidity: t.humidity,
          windSpeed: t.windSpeed,
          windDirection: getRandomFromArray(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']),
          fuelLoad: Math.floor(50 + Math.random() * 50),
          iotDeviceId: t.deviceId
        },
        acknowledged: {
          status: Math.random() > 0.5,
          by: getRandomFromArray(['Fire Dept Zone 1', 'Fire Dept Zone 2', 'Fire Dept Zone 3']),
          at: new Date().toISOString()
        },
        recommendations: rec,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      Alert.createAlert(alertData);
      console.log("ALERT============================")
      console.log(alertData);
      console.log(`Inserted alert for ${t.deviceId}: ${alertData.alertId}`);
    }

  } catch (err) {
    console.error('Error during alert generation:', err);
  }

}

function startAlertGenerationJob() {
  cron.schedule('*/30 * * * *', generateOnceNow);
  generateOnceNow(); // run immediately on startup
}

module.exports = { startAlertGenerationJob };
