const alertService = require('../services/alertService');
const { fetchTelemetryData } = require('../services/weatherTelemetryService');
const {  fetchTrafficIncidentsFromTelemetryPoints} = require('../services/trafficService');
const { generateInsightsPerLocation } = require('../services/gptService');

const getAllAlerts = async (req, res, next) => {
    try {
        const alerts = await alertService.getAllAlerts();
        if (alerts) {
            res.status(200).json({
                'status': 'success',
                'alerts': alerts,
            });
        } else {
            const e = new Error('Alerts not found');
            e.status = 404;
            return next(e);
        }
    } catch (error) {
        const e = new Error('Cannot get all alerts');
        return next(e);
    }
};

const getLastAlerts = async (req, res, next) => {
  try {
    console.log("DEBUG");
      const alerts = await alertService.getLastAlerts();
      console.log(alerts);
      if (alerts) {
          res.status(200).json({
              'status': 'success',
              'alerts': alerts,
          });
      } else {
          const e = new Error('Alerts not found');
          e.status = 404;
          return next(e);
      }
  } catch (error) {
      const e = new Error('Cannot get last alerts');
      return next(e);
  }
};
const getRealTimeAlerts = async (req, res, next) => {
    try {
        const telemetry = await fetchTelemetryData();

        // const geoPoints = telemetry.map(d => ({
        //   lat: d.lat,
        //   lon: d.lon,
        //   locationName: d.locationName
        // }));
        const geoPoints = [
            { lat: 34.1203, lon: -118.2870, locationName: 'Griffith Park' },            // Near urban wildland interface
            { lat: 34.0928, lon: -118.3287, locationName: 'Hollywood Hills' },          // Dense vegetation, residential mix
            { lat: 34.2358, lon: -118.6059, locationName: 'Topanga Canyon' },           // Santa Monica Mountains region
            { lat: 34.1808, lon: -118.3089, locationName: 'Burbank' },                  // Foothills of Verdugo Mountains
            { lat: 34.0633, lon: -117.6509, locationName: 'Ontario' },                  // Inland Empire edge, dry brushlands
            { lat: 34.2694, lon: -118.7815, locationName: 'Simi Valley' },              // Surrounded by hills and open space
          ];
      
        const trafficInsights = await  fetchTrafficIncidentsFromTelemetryPoints(geoPoints);
        console.log(trafficInsights);
        if (trafficInsights) {
            res.status(200).json({
                'status': 'success',
                'alerts': trafficInsights,
            });
        } else {
            const e = new Error('Alerts not found');
            e.status = 404;
            return next(e);
        }
    } catch (error) {
        const e = new Error('Cannot get all alerts');
        return next(e);
    }
};

const createAlert = (req, res, next) => {
    const alertData = req.body;
        alertService.createAlert(alertData).then((alert) => {
            res.status(200).json({
                'message': 'Alert created successfully',
                'Alert': alert,
            });
        }).catch((error) => {
            const e = new Error('Alert creation failed');
            e.status = 400;
            return next(e);
        });
};


const getCombinedTelemetryAndTrafficAlerts = async (req, res, next) => {
    try {
      const telemetry = await fetchTelemetryData();
  
      // Create geoPoints with locationName to use in traffic incident lookup
      const geoPoints = telemetry.map(d => ({
        lat: d.lat,
        lon: d.lon,
        locationName: d.locationName || d.deviceId
      }));

      console.log(geoPoints);
  
      // Fetch incidents around each telemetry point
      const trafficIncidents = await fetchTrafficIncidentsFromTelemetryPoints(geoPoints);
  
      // Index incidents by lat-lon for quick lookup
      const incidentMap = {};
      for (const incident of trafficIncidents) {
        const key = `${incident.locationName}`;
        if (!incidentMap[key]) {
          incidentMap[key] = [];
        }
        incidentMap[key].push(incident);
      }
  
      // Combine telemetry and related traffic incidents
      const combinedAlerts = telemetry.map(t => {
        const locationKey = t.locationName || t.deviceId;
        return {
          ...t,
          trafficIncidents: incidentMap[locationKey] || []
        };
      });
  
      res.status(200).json({
        status: 'success',
        alerts: combinedAlerts
      });
    } catch (error) {
      console.error('Error in combined telemetry + traffic:', error.message);
      const e = new Error('Failed to get combined telemetry and traffic alerts');
      return next(e);
    }
  };

  const getTohilRecommendationsPerLocation = async (req, res, next) => {
    try {
      const telemetry = await fetchTelemetryData();
  
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
  
      res.status(200).json({
        status: 'success',
        insights
      });
  
    } catch (error) {
      console.error('Tohil per-location error:', error.message);
      return next(new Error('Failed to retrieve Tohil insights'));
    }
  };

module.exports = {
    getAllAlerts,
    createAlert,
    getRealTimeAlerts,
    getCombinedTelemetryAndTrafficAlerts,
    getTohilRecommendationsPerLocation,
    getLastAlerts
};