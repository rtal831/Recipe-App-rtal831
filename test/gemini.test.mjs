import { expect } from 'chai';
import sinon from 'sinon';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateRecipe } from '../server/api/gemini/client.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/config.env' });
const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key:', apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

describe('generateRecipe', () => {
    let genAIStub;
    let modelStub;

    before(() => {
        genAIStub = sinon.stub(GoogleGenerativeAI.prototype, 'getGenerativeModel');
        modelStub = sinon.stub(model, 'generateContent');
    });

    after(() => {
        genAIStub.restore();
        modelStub.restore();
    });

    it('should generate recipes', async () => {
        const params = {
            title: 'Recipe 1',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            detailedIngredients: ['Detailed Ingredient 1', 'Detailed Ingredient 2'],
            cookingTime: '1 hour',
            instructions: 'Step 1, Step 2',
            recipeImage: 'recipe-image',
            tags: ['tag1', 'tag2']
        };

        const response = {
            text: () => JSON.stringify({
                title: 'Recipe 1',
                ingredients: ['Ingredient 1', 'Ingredient 2'],
                detailedIngredients: ['Detailed Ingredient 1', 'Detailed Ingredient 2'],
                cookingTime: '1 hour',
                instructions: 'Step 1, Step 2',
                recipeImage: 'recipe-image',
                tags: ['tag1', 'tag2']
            })
        };

        modelStub.returns(Promise.resolve({ response }));

        const recipe = await generateRecipe(params);

        console.log(recipe);

        // Check if recipe text starts as expected
        expect(recipe).to.include('title');
        expect(recipe).to.include('ingredients');
        expect(recipe).to.include('detailedIngredients');
        expect(recipe).to.include('cookingTime');
        expect(recipe).to.include('instructions');
        expect(recipe).to.include('recipeImage');
        expect(recipe).to.include('tags');
    });

    it('should handle errors', async () => {
        const params = {
            title: 1,
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            detailedIngredients: ['Detailed Ingredient 1', 'Detailed Ingredient 2'],
            cookingTime: '1 hour',
            instructions: 'Step 1, Step 2',
            recipeImage: 'recipe-image',
            tags: ['tag1', 'tag2']
        };

        modelStub.throws('Error');
        try {
            await generateRecipe(params);
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });
});