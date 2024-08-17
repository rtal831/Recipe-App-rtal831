const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const recipeRoutes = require('../routes/recipes');

const app = express();
dotenv.config({ path: './config.env' });

app.use(bodyParser.json());

// Routes
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

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(5000, () => console.log('Connected to db and server is running on port 5000.'));
    })
    .catch((error) => console.error('Could not connect to MongoDB...', error));

module.exports = app;
