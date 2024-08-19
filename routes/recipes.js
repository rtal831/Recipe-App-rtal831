const express = require('express')
const Recipe = require('../models/recipeModel')
const { generateRecipe } = require('../server/api/gemini/client');
const { getImageByTitle } = require('../server/api/pexels/client');
const db = require('../server/db');


const router = express.Router()

// GET all recipes
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const recipes = await db.collection('recipes').find().toArray();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get recipes' });
        console.error(error);
    }
});


// GET a specific recipe
router.get('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(req.params.id) });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get recipe' });
        console.error(error);
    }
});

// POST a new recipe
router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const recipe = req.body;
        const result = await (db.collection('recipes')).insertOne(recipe);
        res.json(result.ops[0]);
    } catch (error) {
        console.error('Failed to insert recipe:', error);
        res.status(500).json({ error: 'Failed to insert recipe' });
    }
});

// DELETE a specific recipe
router.delete('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const result = await db.collection('recipes').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recipe' });
        console.error(error);
    }
});

// DELETE all recipes
router.delete('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        await db.collection('recipes').deleteMany();
        res.json({ message: 'All recipes deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recipes' });
        console.error(error);
    }
});

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