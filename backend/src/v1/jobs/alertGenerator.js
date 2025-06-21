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

function generateRandomPentagon(centerLon, centerLat) {
  // 1. pick a random target area A in km² between 3 and 4
  const area = 3 + Math.random() * (4 - 3);

  // 2. for a regular pentagon of side length s: 
  //    A = (5/4) * s² * cot(π/5)
  //    →  s = sqrt(4 A tan(π/5) / 5)
  const tanPiOver5 = Math.tan(Math.PI / 5);
  const s = Math.sqrt((4 * area * tanPiOver5) / 5);

  // 3. radius R from center to each vertex: R = s / (2 sin(π/5))
  const R = s / (2 * Math.sin(Math.PI / 5)); // in km

  // 4. convert km → degrees at this latitude
  const latRad = centerLat * Math.PI / 180;
  const degPerKmLat = 1 / 111.32;              // approx.
  const degPerKmLon = 1 / (111.32 * Math.cos(latRad));

  // 5. pick a random rotation so each pentagon is oriented differently
  const rotation = Math.random() * 2 * Math.PI;

  // 6. build the pentagon vertices
  const coords = [];
  for (let i = 0; i < 5; i++) {
    // each corner is 72° apart
    const theta = rotation + (i * 2 * Math.PI) / 5;
    // offset in km
    const dx = R * Math.cos(theta);
    const dy = R * Math.sin(theta);
    // convert to degrees
    const lon = centerLon + dx * degPerKmLon;
    const lat = centerLat + dy * degPerKmLat;
    coords.push([lon, lat]);
  }
  // close the polygon by repeating the first point
  coords.push(coords[0]);

  return coords;
}

function generateRandomIrregularPentagon(centerLon, centerLat) {
  // 1. pick a random target area A in km² between 3 and 4
  const areaTarget = 3 + Math.random() * (4 - 3);

  // 2. get a rough “base” radius for a regular pentagon of that area
  //    for regular: A = (5/4) s² cot(π/5), R = s/(2 sin(π/5))
  const tanPiOver5 = Math.tan(Math.PI / 5);
  const sBase = Math.sqrt((4 * areaTarget * tanPiOver5) / 5);
  const Rbase = sBase / (2 * Math.sin(Math.PI / 5)); // in km

  // 3. generate 5 random radii around Rbase (to introduce irregularity)
  //    here each radius is between 60% and 140% of Rbase
  const radii = Array.from({ length: 5 }, () => 
    Rbase * (0.6 + 0.8 * Math.random())
  );

  // 4. pick a random rotation offset
  const rotation = Math.random() * 2 * Math.PI;

  // 5. build preliminary km‐coordinates for the 5 points
  const ptsKm = radii.map((r, i) => {
    const angle = rotation + (i * 2 * Math.PI) / 5;
    return [ r * Math.cos(angle), r * Math.sin(angle) ]; // [dx, dy] in km
  });

  // 6. compute the polygon’s current area (planar shoelace, in km²)
  let sum = 0;
  for (let i = 0; i < ptsKm.length; i++) {
    const [x1, y1] = ptsKm[i];
    const [x2, y2] = ptsKm[(i + 1) % ptsKm.length];
    sum += x1 * y2 - x2 * y1;
  }
  const areaCurrent = Math.abs(sum) / 2;

  // 7. compute a scale factor so that areaCurrent * scale² = areaTarget
  const scale = Math.sqrt(areaTarget / areaCurrent);

  // 8. convert scaled points into [lon, lat], closing the ring
  const latRad = centerLat * Math.PI / 180;
  const degPerKmLat = 1 / 111.32;
  const degPerKmLon = 1 / (111.32 * Math.cos(latRad));

  const coords = ptsKm.map(([dx, dy]) => {
    const lon = centerLon + (dx * scale) * degPerKmLon;
    const lat = centerLat + (dy * scale) * degPerKmLat;
    return [lon, lat];
  });
  // repeat first point to close
  coords.push(coords[0]);

  return coords;
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
            coordinates: [generateRandomIrregularPentagon(t.lon, t.lat)]
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

      alertData['_id'] = new mongoose.Types.ObjectId();
      Alert.createAlert(alertData);
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
