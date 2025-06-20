const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { startAlertGenerationJob } = require('./src/v1/jobs/alertGenerator');


require('dotenv').config();


const app = express();

const port = process.env.PORT || 8080;

async function startDB() {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log('MongoDB connected');
  
  
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1); // exit with failure
    }
  }


startDB();



const alertRouter = require('./src/v1/routes/hazardAlertRoutes');

// Use morgan to log requests to the console
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}
// Set up body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS configuration
app.use((req, res, next) => {
    // Allow any origin to access this API, for developing purposes
    // Should be set a specific origin for production
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET, OPTIONS');
        return res.status(200).json({});
    }
    if (req.method !== 'OPTIONS' &&
    req.method !== 'GET' &&
    req.method !== 'POST' &&
    req.method !== 'DELETE' &&
    req.method !== 'PATCH') {
        const error = new Error('Method not allowed');
        error.status = 405;
        next(error);
    }
    next();
});

// Reduce Fingerprinting
app.disable('x-powered-by');

app.use('/v1/alerts', alertRouter);

// Handle requests to invalid resources
app.use((req, res, next) => {
    const error = new Error('Invalid request! No resource was found!');
    error.status = 404; // Not Found
    next(error);
});

// Handle errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        'error': {
            'message': error.message,
        },
    });
});

// Cron Job every ten minutes to grab new alert data
startAlertGenerationJob();

const server = app.listen(port, () => {
    console.log('Server started on port ' + port);
});


module.exports = server;