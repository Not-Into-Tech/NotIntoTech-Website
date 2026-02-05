require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('../src/database/db');
const router = require('../src/routes/router');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../src/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

app.use('/', router);

module.exports = app;
