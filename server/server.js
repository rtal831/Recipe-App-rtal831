const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const recipeRoutes = require('../routes/recipes');

app.use(bodyParser.json());

// Routes
app.use('/api/recipes', recipeRoutes);

let ingredients = [];

app.get("/api", (req, res) => {
    res.json({ ing: ingredients });
});

app.post("/api/add", (req, res) => {
    const { ingredient } = req.body;
    if (ingredient) {
        ingredients.push(ingredient);
    }
    res.json({ ing: ingredients });
});

app.post("/api/reset", (req, res) => {
    ingredients = [];
    res.json({ ing: ingredients });
});

// Connecting to the database
require("dotenv").config({path: "./config.env"});
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000, () => console.log('Connected to db and server is running on port 5000.'));
    })
    .catch((error) => console.error('Could not connect to MongoDB...'));

