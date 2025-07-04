const mongoose = require('mongoose');
const Alert = require('../database/alerts');

const getAllAlerts = () => {
    return Alert.getAllAlerts();
};
const getLastAlerts = () => {
    return Alert.getLastAlerts();
};
const createAlert = async (alertData) => {
    alertData['_id'] = new mongoose.Types.ObjectId();
    return Alert.createAlert(alertData);
};

module.exports = {
    getAllAlerts,
    createAlert,
    getLastAlerts
};