const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        if (!url) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        await mongoose.connect(url, {
            dbName: 'notintotech-website'
        });
        
        console.log('Database is connected to: notintotech-website');
        console.log('Environment:', process.env.NODE_ENV || 'development');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

module.exports = connectDB;