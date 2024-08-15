const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    cookingTime: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    recipeImage: {
        type: String,
        required: false
    }   
}, {timestamps: true});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;