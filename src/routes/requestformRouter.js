const express = require('express');
const User = require('../model/request-model');
const router = express.Router();

router.post('/request-form', async (req, res) => {
    try {
        console.log('Received request data:', req.body);

        const newUser = new User({
            request_name: req.body['request-name'],
            request_email: req.body['request-email'],
            request_text: req.body['request-text'],
        });
        await newUser.save();
        console.log('Request sent successfully');

        res.render('request-data', {
            message: 'Request sent!',
            error: null
        });
    } catch (err) {
        console.error('Error sending request:', err);
        res.status(500).render(
            'request-data',
            {
                message: null,
                error: 'Error sending request'
            }
        );
    }
});

module.exports = router;