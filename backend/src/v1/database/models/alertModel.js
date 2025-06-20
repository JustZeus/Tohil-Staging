const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  alertId: { type: String, required: true },
  title: { type: String, required: true },
  severity: { type: Number, required: true, min: 1, max: 4 },

  sector: {
    id: { type: String, required: true },
    name: { type: String },
    polygon: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true
      },
      coordinates: {
        type: [[[Number]]], // Array of array of [lng, lat]
        required: true
      }
    }
  },

  telemetry: {
    temperature: { type: Number },
    humidity: { type: Number },
    windSpeed: { type: Number },
    windDirection: { type: String },
    fuelLoad: { type: Number },
    iotDeviceId: { type: String }
  },

  acknowledged: {
    status: { type: Boolean, default: false },
    by: { type: String },
    at: { type: Date }
  },

  recommendations: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Enable GeoJSON 2dsphere index for polygon
alertSchema.index({ "sector.polygon": "2dsphere" });

module.exports = mongoose.model('Alert', alertSchema);