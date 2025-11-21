const express = require('express');
const router = express.Router();

router.get('/article', (req, res) => {
    res.render('page-article', { message: null, error: null });
});

module.exports = router;