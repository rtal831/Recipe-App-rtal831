const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

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

app.listen(5000, () => console.log('Server is running on port 5000.'));
