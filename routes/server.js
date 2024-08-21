const express = require('express');
const router = express.Router();

let generated_recipes = [];

// Endpoint to add generated recipes to the backend
router.post('/generated-recipes', (req, res) => {
    const { recipes } = req.body;

    if (recipes && Array.isArray(recipes)) {
        generated_recipes = recipes; // Replace existing recipes with the new ones
        res.status(200).send({ message: 'Recipes stored successfully' });
    } else {
        res.status(400).send({ message: 'Invalid recipe data' });
    }
});

// Endpoint to see generated recipes
router.get('/generated-recipes', (req, res) => {
    res.json({ generatedRecipes: generated_recipes });
});

// Endpoint to clear generated recipes
router.delete('/generated-recipes', (req, res) => {
    generated_recipes = [];
    res.json({ generatedRecipes: generated_recipes });
});

module.exports = router;
