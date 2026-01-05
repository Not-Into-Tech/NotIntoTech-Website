const express = require('express');
const User = require('../model/feedback-model');
const router = express.Router();

router.post('/feedback-form', async (req, res) => {
    try {
        console.log('Received feedback data:', req.body);

        const newUser = new User({
            feedback_name: req.body['feedback-name'],
            feedback_email: req.body['feedback-email'],
            feedback_text: req.body['feedback-text'],
        });
        await newUser.save();
        console.log('Feedback saved successfully');

        res.render('index', { 
            message: 'Feedback submitted successfully!', 
            error: null 
        });
    } catch (err) {
        console.error('Error saving user data:', err);
        res.status(500).render(
            'index',
            {
                message: null,
                error: 'Error saving user data' 
            }
        );
    }
});

module.exports = router;