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
        console.log('Request saved successfully');

        res.render('request-data', { 
            message: 'Request submitted successfully!', 
            error: null 
        });
    } catch (err) {
        console.error('Error saving request data:', err);
        res.status(500).render(
            'request-data',
            {
                message: null,
                error: 'Error saving request data' 
            }
        );
    }
});

module.exports = router;