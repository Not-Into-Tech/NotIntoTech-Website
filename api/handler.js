require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('../src/database/db');
const router = require('../src/routes/router');

let app;
let dbConnected = false;

const createApp = () => {
    const app = express();

    if (!dbConnected) {
        connectDB().catch(err => console.error('DB connection error:', err));
        dbConnected = true;
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../src/public')));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../src/views'));

    app.use('/', router);

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
    });

    return app;
};

module.exports = (req, res) => {
    if (!app) {
        app = createApp();
    }
    return app(req, res);
};
