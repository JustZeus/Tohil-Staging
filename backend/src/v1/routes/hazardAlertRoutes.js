const express = require('express');
const router = new express.Router();
const alertController = require('../controllers/alertController');
const telemetryController = require('../controllers/weatherController');

router.get('/', alertController.getAllAlerts);
router.get('/last', alertController.getLastAlerts);
router.post('/', alertController.createAlert);
router.get('/telemetry', telemetryController.getTelemetryData);
router.get('/traffic', alertController.getRealTimeAlerts);
router.get('/combined', alertController.getCombinedTelemetryAndTrafficAlerts);
router.get('/recomendations', alertController.getTohilRecommendationsPerLocation);

module.exports = router;