"use client";

import React, { useMemo } from "react";
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
import { useSearchParams } from "next/navigation";

// const randomColor = () => {
//     const colors = ["primary", "success", "warning"];
    
//     return colors[Math.floor(Math.random() * colors.length)];
// }


export default function App() {
  // Retrieve the "data" search parameter from the URL
  const searchParams = useSearchParams().get("data");
  
  const recipeData = useMemo(() => {
    try {
      return JSON.parse(searchParams);
    } catch (error) {
      console.error("Failed to parse recipe data:", error);
      return [];
    }
  }, [searchParams]);

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
              <Button color="success" size="small">
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
