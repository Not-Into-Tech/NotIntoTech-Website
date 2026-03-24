// user for local testing or deployment

require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./src/database/db');
const router = require('./src/routes/router');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Proxy Route for Chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const n8nUrl = process.env.N8N_WEBHOOK_URL;

        const n8nResponse = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                source: 'web-client',
                timestamp: new Date().toISOString()
            })
        });

        if (!n8nResponse.ok) {
            throw new Error(`n8n responded with status: ${n8nResponse.status}`);
        }

        const data = await n8nResponse.json();

        // Send the n8n response back to the browser
        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with the advisory core.' });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app