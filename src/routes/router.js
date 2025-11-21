const express = require('express');
const router = express.Router();
const homeRoutes = require('./homeRouter');
const articleRoutes = require('./articleRouter');
const feedbackformRoutes = require('./feedbackformRouter');
const requestRoutes = require('./requestRouter');
const comingsoonRoutes = require('./comingsoonRouter');
const datasetRoutes = require('./datasetRouter');

router.use('/', homeRoutes);
router.use('/', articleRoutes);
router.use('/', feedbackformRoutes);
router.use('/', requestRoutes);
router.use('/', comingsoonRoutes);
router.use('/', datasetRoutes);

module.exports = router;