'use client';

import React, { useState } from 'react';
import { Card, Divider } from "@nextui-org/react";
import RecipeImage from './RecipeImage';
import Ingredients from './Ingredients';
import RecipeHeader from './RecipeHeader';
import RecipeInstructions from './RecipeInstructions';

export default function RecipePage() {
    const [recipe, setRecipe] = useState({
        title: "Chocolate Chip Cookies",
        ingredients: `1 cup all-purpose flour
        1/2 cup granulated sugar
        1/4 cup unsalted butter, softened
        1 pinch of salt
        1 cup chocolate chips
        1/2 tsp baking powder
        1/4 cup brown sugar
        1 tsp vanilla extract
        1/2 tsp baking soda
        1 large egg`,
        cookingTime: 25,
        instructions: `1. Preheat the oven to 350°F (175°C) and grease a 9-inch round cake pan or line it with parchment paper.
        2. In a medium bowl, whisk together the flour, baking powder, and salt.
        3. In a large bowl, cream the butter and sugar together until light and fluffy.
        4. Beat in the egg, one at a time, then add the vanilla extract.
        5. Gradually add the dry ingredients to the butter mixture, alternating with the milk. Mix until just combined.
        6. Fold in the chocolate chips, if using.
        7. Pour the batter into the prepared pan and smooth the top with a spatula.
        8. Put in the oven on bake for 25 minutes.
        9. Serve with whipped cream and enjoy!
        10. Testing overflow
        11. Testing overflow
        12. Testing overflow`,
        recipeImage: "/cookie.jpg",
    });

    const handleSaveRecipe = () => {
        console.log("Recipe saved!");
    };

    return (
        <div style={styles.pageContainer}>
            <Card style={styles.recipeContainer}>
                <div style={styles.leftSide}>
                    <RecipeImage src={recipe.recipeImage} alt="Cookie" />
                    <Ingredients ingredients={recipe.ingredients} />
                </div>
                <div style={styles.rightSide}>
                    <RecipeHeader title={recipe.title} onSave={handleSaveRecipe} />
                    <Divider />
                    <RecipeInstructions instructions={recipe.instructions} />
                </div>
            </Card>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'white',
        paddingTop: '100px'
    },
    recipeContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '10px',
        maxWidth: '1200px',
        maxHeight: '800px',
        width: '70%',
        borderRadius: '12px',
        padding: '10px',
        height: '70vh',
    },
    leftSide: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    rightSide: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '400px',
        border: '2px solid #f0f0f0',
        borderRadius: '8px'
    },
};
