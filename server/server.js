const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./db');

const app = express();
dotenv.config({ path: './config.env' });

app.use(bodyParser.json());

// Connect to the database and start the server
const startServer = async () => {
    try {
        const db = await connectDB();
        app.locals.db = db;
        app.listen(5000, () => console.log('Server is running on port 5000.'));
    } catch (error) {
        console.error('Failed to start the server', error);
        process.exit(1); // Exit the process with failure
    }
};

startServer();
const recipeModel = require('../models/recipeModel');
const recipeRoutes = require('../routes/recipes');
app.use('/api/recipes', recipeRoutes);

let ingredients = [];

// Endpoint to retrieve ingredients
app.get("/api", (req, res) => {
    res.json({ ing: ingredients });
});

// Endpoint to add an ingredient
app.post("/api/add", (req, res) => {
    const { ingredient } = req.body;
    if (ingredient) {
        ingredients.push(ingredient);
    }
    res.json({ ing: ingredients });
});

// Endpoint to reset ingredients
app.post("/api/reset", (req, res) => {
    ingredients = [];
    res.json({ ing: ingredients });
});

module.exports = app;