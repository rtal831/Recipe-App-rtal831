const express = require('express')
const Recipe = require('../models/recipeModel')

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

module.exports = router