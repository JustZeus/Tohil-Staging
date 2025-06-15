const Alert = require('./models/alertModel');

const getAllAlerts = async () => {
    const alerts = await Alert.find().exec();
    return alerts;
};
const createAlert = (alertData) => {
    const newAlert = new Alert(alertData);
    return newAlert.save();
};

module.exports = {
    getAllAlerts,
    createAlert
};