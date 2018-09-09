const path = require('path');
const cors = require('cors');
const express = require('express');
const errorHandler = require('errorhandler');
const auth = require('http-auth');

const rootDir = path.join(__dirname, '..');
const apiRouter = require(path.join(rootDir, 'app/routes/api'));
const formsRouter = require(path.join(rootDir, 'app/routes/forms'));
const config = require(path.join(rootDir, 'app/lib/config'));

// Setup server
const app = express();

// Configure server
app.use(cors({origin: config.corsHeader }));
app.use(express.static(path.join(rootDir, '/public')));

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
} else if (process.env.NODE_ENV === 'production') {
  app.use(errorHandler());
}

// Attach routes
app.use('/', formsRouter);

if (config.adminUsername && config.adminPassword) {
    const basic = auth.basic({
        realm: config.adminRealm
    }, (username, password, callback) => {
        let authSuccess =
            (username === config.adminUsername) &&
            (password === config.adminPassword);
        callback(authSuccess);
    });

    app.use('/api', auth.connect(basic), apiRouter);
    app.use('/admin', auth.connect(basic), express.static(path.join(rootDir, '/admin')));
}

// Module
module.exports = app;

