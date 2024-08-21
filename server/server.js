const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const recipeRoutes = require('../routes/recipes');
const serverRoutes = require('../routes/server'); // Import the new routes file
const connectDB = require('./db');

const app = express();
dotenv.config({ path: './config.env' });

app.use(cors());
app.use(bodyParser.json());

app.use('/api/recipes', recipeRoutes);
app.use('/api/server', serverRoutes);

// Connect to the database and start the server
const startServer = async () => {
    try {
        const db = await connectDB();
        app.locals.db = db;
        app.listen(5000, () => console.log('Server is running on port 5000.'));
    } catch (error) {
        console.error('Failed to start the server', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
