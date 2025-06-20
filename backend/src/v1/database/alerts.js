const Alert = require('./models/alertModel');

const getAllAlerts = async () => {
    const alerts = await Alert.find().exec();
    return alerts;
};
const getLastAlerts = async () => {
    console.log("DEBUG3");
    const alerts = await Alert.find().sort({ _id: -1 }).limit(3).exec();
    return alerts;
  };
const createAlert = (alertData) => {
    const newAlert = new Alert(alertData);
    return newAlert.save();
};

module.exports = {
    getAllAlerts,
    getLastAlerts,
    createAlert
};