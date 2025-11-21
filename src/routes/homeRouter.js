const express = require('express');
const User = require('../model/model');
const router = express.Router();

// GET route for the home page
router.get('/', (req, res) => {
    res.render('index', { message: null, error: null });
});

module.exports = router;