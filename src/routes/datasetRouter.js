const express = require('express');
const router = express.Router();
const supabase = require('../database/supabaseClient'); // Add Supabase client

router.get('/data', async (req, res) => {
    try {
        // Fetch datasets from Supabase
        const { data: datasets, error } = await supabase
            .from('datasets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching datasets from Supabase:', error);
            // Render with empty array if there's an error
            res.render('page-dataset', { datasets: [], message: null, error: 'Failed to load datasets' });
        } else {
            res.render('page-dataset', { datasets, message: null, error: null });
        }
    } catch (err) {
        console.error('Unexpected error in dataset route:', err);
        res.render('page-dataset', { datasets: [], message: null, error: 'Failed to load datasets' });
    }
});

module.exports = router;