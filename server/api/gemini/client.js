const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


const generateRecipe = async (params) => {
    try {

        const prompt = "You are a recipe generator. Generate five to ten recipes with the following details:\n1. Recipe Name\n2. List of Ingredients without portion\n3. Detailed list of ingredients\n4. Step-by-Step Cooking Instructions\n5. Cooking Time\n6. Number of Servings\n7.Tags related to the dish(eg:spicy,healthy)\n8. Name of image (this must be a 1-2 word description with any space characters replaced by '-') from the following prompts:"
        + JSON.stringify(params)
        +"\nFormat the response as a JSON object with fields `title`, `ingredients`, 'detailedIngredients' , `cookingTime`, `instructions`, 'recipeImage','tags'. Your response must only be in these json fields with no other information";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('Response:', response.text());
        return response.text();
    } catch (error) {
        console.error('Error communicating with Gemini API:', error);
        throw error;
    }
};


module.exports = { generateRecipe };
