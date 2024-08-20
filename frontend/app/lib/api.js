export async function generateRecipe(ingredients, cuisine, dietaryPreferences, mealType, servings) {
    // Construct the recipeData object in JSON format
    const recipeData = {
      ingredients,
      cuisine,
      dietaryPreferences,
      mealType,
      servings
    };
  
    console.log('Params:', recipeData); // Log the parameters to ensure they are correct
  
    try {
      const response = await fetch('http://localhost:5000/api/recipes/only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData), // Convert the object to a JSON string
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      throw error;
    }
  }
  