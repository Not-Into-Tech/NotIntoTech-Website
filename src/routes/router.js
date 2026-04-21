const express = require('express');
const router = express.Router();
const homeRoutes = require('./homeRouter');
const insightsRoutes = require('./insightsRouter');
const feedbackformRoutes = require('./feedbackformRouter');
const requestRoutes = require('./requestRouter');
const requestformRoutes = require('./requestformRouter');
const comingsoonRoutes = require('./comingsoonRouter');
const datasetRoutes = require('./dataRouter');
const errorRoutes = require('./errorRouter');
const aiRoutes = require('./aiRouter');
const profileRoutes = require('./profileRouter');
const insightsApiRoutes = require('./insightsApiRouter');

router.use('/', homeRoutes);
router.use('/', profileRoutes);
router.use('/', insightsRoutes);
router.use('/', insightsApiRoutes);
router.use('/', datasetRoutes);
router.use('/', requestRoutes);
router.use('/', aiRoutes);
router.use('/', feedbackformRoutes);
router.use('/', requestformRoutes);
router.use('/', comingsoonRoutes);
router.use('/', errorRoutes);

module.exports = router;