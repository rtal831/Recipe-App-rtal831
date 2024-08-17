const express = require('express')
const Recipe = require('../models/recipeModel')
const { generateRecipe } = require('../server/api/gemini/client');
const { getImageByTitle } = require('../server/api/pexels/client');


const router = express.Router()

// GET all recipes
router.get('/', (req, res) => {
    res.json({ message: 'Get all recipes'})
})

// GET a specific recipe
router.get('/:id', (req, res) => {
    res.json({ message: 'Get a specific recipe'})
})

// POST a new recipe
router.post('/', async (req, res) => {
    res.json({ message: 'Post a new recipe' })
})

// DELETE a specific recipe
router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete a recipe'})
})

// UPDATE a specific recipe
router.patch('/:id', (req, res) => {
    res.json({ message: 'Update a recipe'})
})

// generating recipe using Gemini API
router.post('/generate', async (req, res) => {
    const { ingredients, cuisine, dietaryPreferences, mealType, servings } = req.body;

    const params = {
        ingredients: ingredients,
        cuisine: cuisine,
        dietaryPreferences: dietaryPreferences,
        mealType: mealType,
        servings: servings
    };
    console.log('Params:', params);
    
    try {
        const recipeData = await generateRecipe(params);
        // remove the ```json``` and newline characters from the response
        const cleanedData = recipeData.replace(/```json|```|\n/g, '');
        let parsedData = JSON.parse(cleanedData);


        // Add the image URL to the response
        const recipeImage = await getImageByTitle(parsedData.recipeImage);
        console.log('Recipe Image:', recipeImage);
        parsedData.recipeImage = recipeImage;

        console.log('Parsed Data:', parsedData);
        res.json(parsedData);


        
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
});

module.exports = router