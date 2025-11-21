const express = require('express');
const router = express.Router();

router.get('/dataset', (req, res) => {
    res.render('page-dataset', { message: null, error: null });
});

module.exports = router;