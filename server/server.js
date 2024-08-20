const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const recipeRoutes = require('../routes/recipes');
const connectDB = require('./db');

const app = express(); 
dotenv.config({ path: './config.env' });

app.use(cors());
app.use(bodyParser.json());

app.use('/api/recipes', recipeRoutes);

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
