const axios = require('axios');
const turf = require('@turf/helpers');
const dotenv = require('dotenv');
dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const AIR_QUALITY_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

/**
 * Example device registry (mock)
 */
async function fetchDeviceList() {

  const geoPoints = [
    { lat: 34.1203, lon: -118.2870, locationName: 'Griffith Park' },            // Near urban wildland interface
    { lat: 34.0928, lon: -118.3287, locationName: 'Hollywood Hills' },          // Dense vegetation, residential mix
    { lat: 34.2358, lon: -118.6059, locationName: 'Topanga Canyon' },           // Santa Monica Mountains region
    { lat: 34.1808, lon: -118.3089, locationName: 'Burbank' },                  // Foothills of Verdugo Mountains
    { lat: 34.0633, lon: -117.6509, locationName: 'Ontario' },                  // Inland Empire edge, dry brushlands
    { lat: 34.2694, lon: -118.7815, locationName: 'Simi Valley' },              // Surrounded by hills and open space
  ];

  return [
    { deviceId: 'sensor-LA01', lat: 34.1808, lon: -118.3089 },     // 'Burbank'
    { deviceId: 'sensor-SD01', lat: 34.0633, lon: -117.6509 },     // 'Ontario'
    { deviceId: 'sensor-SF01', lat: 34.2694, lon: -118.7815 },     // 'Simi Valley'
  ];
}

/**
 * Get weather telemetry from OpenWeather
 */
async function getWeatherTelemetry(lat, lon) {
  const url = `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return {
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    windSpeed: response.data.wind.speed,
    weather: response.data.weather[0].main,
    weatherDescription: response.data.weather[0].description,
    locationName: response.data.name || `${lat},${lon}`
  };
}

/**
 * Get air quality from OpenWeather
 */
async function getAirQuality(lat, lon) {
  const url = `${AIR_QUALITY_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
  const response = await axios.get(url);
  const aqi = response.data.list[0];
  return {
    airQualityIndex: aqi.main.aqi,
    components: aqi.components
  };
}

/**
 * Merge all telemetry sources for each device, and add geo data
 */
async function fetchTelemetryData() {
  const devices = await fetchDeviceList();

  const telemetryPromises = devices.map(async device => {
    const { lat, lon } = device;
    const weather = await getWeatherTelemetry(lat, lon);
    const airQuality = await getAirQuality(lat, lon);

    return {
      ...device,
      ...weather,
      ...airQuality,
      geospatial: turf.point([lon, lat]), // GeoJSON point
      timestamp: new Date().toISOString()
    };
  });

  return Promise.all(telemetryPromises);
}

module.exports = {
  fetchTelemetryData,
};