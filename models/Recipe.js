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
        type: Number,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    recipeImage: {
        data: Buffer,
        contentType: String,
        required: true
    }   
}, {timestamps: true});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;