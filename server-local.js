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

// Proxy route for chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body || {};

        if (!message) {
            return res.status(400).json({ error: "Missing 'message' in request" });
        }

        const n8nUrl = process.env.N8N_WEBHOOK_URL;

        const n8nResponse = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId || 'default_session',
                source: 'web-client',
                timestamp: new Date().toISOString()
            })
        });

        if (!n8nResponse.ok) {
            const errBody = await n8nResponse.text();
            throw new Error(`chatbot responded with status: ${n8nResponse.status}, body: ${errBody}`);
        }

        const rawText = await n8nResponse.text();
        let data;

        // parse json data
        try {
            data = rawText ? JSON.parse(rawText) : { response: "Empty response from chatbot" };
        } catch (e) {
            data = { response: rawText };
        }

        // send the n8n response back to the browser
        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with the chatbot.', details: error.message });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app