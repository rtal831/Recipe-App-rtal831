'use client';

import React, { useEffect, useState } from 'react';
import { Card, Divider } from "@nextui-org/react";
import RecipeImage from './RecipeImage';
import Ingredients from './Ingredients';
import RecipeHeader from './RecipeHeader';
import RecipeInstructions from './RecipeInstructions';
import { useRouter, useSearchParams } from 'next/navigation';

// http:localhost:3000/recipe-result
export default function RecipePage() {
    const [recipe, setRecipe] = useState(null);
    const searchParams = useSearchParams();

    // get specific recipe from backend
    useEffect(() => {
        const resultId = searchParams.get('result-id');
        if (resultId) {
            const fetchRecipe = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/server/generated-recipes/${resultId}`);
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }
                    const recipeData = await response.json();

                    // Remove quotes from the recipeImage field
                    if (recipeData.recipeImage) {
                        recipeData.recipeImage = recipeData.recipeImage.replace(/^(["'])|(["'])$/g, '');
                    }

                    setRecipe(recipeData);
                } catch (error) {
                    console.error("Failed to fetch recipe data:", error);
                }
            };

            fetchRecipe();
        }
    }, [searchParams]);

    if (!recipe) {
        return <p>Loading...</p>;
    }

    const handleSaveRecipe = () => {
        console.log("Recipe saved!");
    };

    return (
        <div style={styles.pageContainer}>
            <Card style={styles.recipeContainer}>
                <div style={styles.leftSide}>
                    <RecipeImage src={recipe.recipeImage} alt="Recipe Image" />
                    <Ingredients ingredients={recipe.detailedIngredients} />
                </div>
                <div style={styles.rightSide}>
                    <RecipeHeader title={recipe.title} onSave={handleSaveRecipe} />
                    <Divider />
                    <RecipeInstructions instructions={recipe.instructions} cookingTime={recipe.cookingTime} />
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
        paddingTop: '100px',
        marginTop: '-130px'
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
        border: '2px solid #6D28D9'
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
