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

// Endpoint to get a specific recipe
router.get('/generated-recipes/:resultId', (req, res) => {
    console.log('Received request for recipe with resultId:', req.params.resultId);

    const resultId = parseInt(req.params.resultId, 10);

    if (isNaN(resultId)) {
        console.error('Invalid resultId:', req.params.resultId);
        return res.status(400).json({ error: 'Invalid result ID' });
    }

    // Check if resultId is within the bounds of the generated_recipes array
    if (resultId < 0 || resultId > generated_recipes.length) {
        console.error('Result ID out of range:', resultId);
        return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = generated_recipes.find(r => r['result-id'] === resultId);

    if (recipe) {
        res.json(recipe);
    } else {
        console.error('Recipe not found for resultId:', resultId);
        res.status(404).json({ error: 'Recipe not found' });
    }
});

module.exports = router;
