require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('../src/database/db');
const router = require('../src/routes/router');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files   
app.use(express.static(path.join(__dirname, '../src/public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

// Routes
app.use('/', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;