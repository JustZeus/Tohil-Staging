const alertService = require('../services/alertService');
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

module.exports = {
    getAllAlerts,
    createAlert
};