require('dotenv').config();
const express = require('express');
const path = require('path');

let app;
let dbConnected = false;

const createApp = async () => {
    const app = express();

    // Lazy load DB connection
    if (!dbConnected) {
        try {
            const connectDB = require('../src/database/db');
            await connectDB();
            dbConnected = true;
        } catch (err) {
            console.error('DB connection error:', err.message);
        }
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../src/public')));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../src/views'));

    try {
        const router = require('../src/routes/router');
        app.use('/', router);
    } catch (err) {
        console.error('Router error:', err);
        app.get('/', (req, res) => {
            res.status(500).send('Router initialization error');
        });
    }

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
    });

    return app;
};

module.exports = async (req, res) => {
    try {
        if (!app) {
            app = await createApp();
        }
        return app(req, res);
    } catch (err) {
        console.error('Handler error:', err);
        res.status(500).json({ error: 'Function initialization failed', message: err.message });
    }
};
