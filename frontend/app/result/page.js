'use client';

import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

// http://localhost:3000/result
export default function App() {
    const [recipeData, setRecipeData] = useState([]);
    const router = useRouter();

    // get the recipes from the backend
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/server/generated-recipes');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecipeData(data.generatedRecipes || []);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    });

    // send to recipe-result screen
    async function handleViewButtonClick(recipe) {
        try {

            // generate image url
            const response = await fetch('http://localhost:5000/api/recipes/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipe),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            // Get the generated recipeImageUrl
            const recipeImageUrl = await response.text()

            const resultId = recipe['result-id'];
            const encodedRecipeImage = encodeURIComponent(recipeImageUrl);

            // send recipeImageUrl to specific recipe in the backend
            const updateResponse = await fetch(`http://localhost:5000/api/server/update-image/${resultId}/${encodedRecipeImage}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!updateResponse.ok) {
                console.log(error);
                throw new Error(`Error updating recipe image: ${updateResponse.statusText}`);
            }

            router.push(`/recipe-result?result-id=${resultId}`);
        } catch (error) {
            console.error('Error handling view button click:', error);
        }
    }

    const renderCell = React.useCallback(
        (recipe, columnKey) => {
            switch (columnKey) {
                case "recipe":
                    return (
                        <div>
                            <p className="text-bold text-sm">{recipe.title}</p>
                            <p className="text-sm text-default-400">Cook Time: {recipe.cookingTime}</p>
                        </div>
                    );
                case "ingredients":
                    return (
                        <p className="text-sm text-default-600">
                            {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : "N/A"}
                        </p>
                    );
                case "tags":
                    const displayedTags = recipe.tags.slice(0, 3);
                    return (
                        <div className="flex gap-2">
                            {displayedTags.map((tag) => (
                                <Chip
                                    key={tag}
                                    className="capitalize"
                                    color={"primary"}
                                    size="sm"
                                    variant="flat"
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </div>
                    );
                case "actions":
                    return (
                        <div className="relative flex items-center gap-2">
                            <Button
                                color="success"
                                size="small"
                                onClick={() => handleViewButtonClick(recipe)}
                            >
                                View
                            </Button>
                        </div>
                    );
                default:
                    return null;
            }
        },
        []
    );

    // Render the table only if the recipe data is available
    return recipeData.length > 0 ? (
        <Table
            aria-label="Recipe Details"
            className="w-4/5 mx-auto mt-6 shadow-lg rounded-lg border border-gray-200"
        >
            <TableHeader>
                <TableColumn key="recipe" align="start">
                    <span className="font-semibold text-lg text-gray-700">Recipe</span>
                </TableColumn>
                <TableColumn key="ingredients" align="start">
                    <span className="font-semibold text-lg text-gray-700">Ingredients</span>
                </TableColumn>
                <TableColumn key="tags" align="start">
                    <span className="font-semibold text-lg text-gray-700">Tags</span>
                </TableColumn>
                <TableColumn key="actions" align="center">
                    <span className="font-semibold text-lg text-gray-700">Actions</span>
                </TableColumn>
            </TableHeader>
            <TableBody>
                {recipeData.map((recipe, index) => (
                    <TableRow key={index}>
                        <TableCell>{renderCell(recipe, "recipe")}</TableCell>
                        <TableCell>{renderCell(recipe, "ingredients")}</TableCell>
                        <TableCell>{renderCell(recipe, "tags")}</TableCell>
                        <TableCell>{renderCell(recipe, "actions")}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ) : (
        <div className="w-4/5 mx-auto mt-6">
            <p className="text-center text-gray-500">No recipe data available.</p>
        </div>
    );
}
