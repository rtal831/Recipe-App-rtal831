"use client";

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import DropDown from './DropDown';
import { generateRecipe } from '../lib/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [mealType, setMealType] = useState('Any');
  const [servingSize, setServingSize] = useState('Any');
  const [cuisine, setCuisine] = useState('Any');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false); // State to track input error
  const [loadingMessage, setLoadingMessage] = useState('Loading recipes, please wait');

  const router = useRouter();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setInputError(false); // Reset input error if user starts typing
    }
  };

  const handleDropDownSelect = (label, option) => {
    if (label === 'Meal Type') setMealType(option);
    if (label === 'Serving Size') setServingSize(option);
    if (label === 'Cuisine') setCuisine(option);
  };

  useEffect(() => {
    let timer;
    if (loading) {
      const messages = ['Loading recipes, please wait', 'Loading recipes, please wait.', 'Loading recipes, please wait..', 'Loading recipes, please wait...'];
      let index = 0;
      timer = setInterval(() => {
        setLoadingMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, 500); // Update message every 500ms
    } else {
      setLoadingMessage('Loading recipes, please wait');
    }

    return () => clearInterval(timer);
  }, [loading]);
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setInputError(true);
      return;
    }
    const ingredients = query;
    const selectedCuisine = cuisine;
    const selectedMealType = mealType;
    const selectedServingSize = servingSize;
    const dietaryPreferences = 'none';

    setLoading(true);

    try {

      // call gemini to get recipes
      const data = await generateRecipe(ingredients, selectedCuisine, dietaryPreferences, selectedMealType, selectedServingSize);

      // clear generated recipes in backend | have to call this after the api call otherwise no recipe data is shown
      await fetch('http://localhost:5000/api/server/generated-recipes', {
        method: 'DELETE',
      });

      // store generated recipes in backend
      const response = await fetch('http://localhost:5000/api/server/generated-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipes: data })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/result');
    } catch (error) {
      console.error('Error fetching or storing the recipe:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex justify-center mb-4 w-full">
        <form className="w-full max-w-xl" onSubmit={handleSearch}>
          <div className="flex space-x-4">
            <div className="flex rounded-md overflow-hidden w-full">
              <input
                type="text"
                className={`w-full rounded-l-md border-2 p-2 ${inputError ? 'border-red-500' : 'border-black'}`}
                placeholder="Enter Recipe name or ingredients.."
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className="bg-black text-white px-6 text-lg font-semibold py-2 rounded-r-md"
                disabled={loading}
              >
                {loading ? 'Loading' : 'Go'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-4 w-full max-w-xl">
        <DropDown
          label="Meal Type"
          options={["Breakfast", "Lunch", "Dinner", "Any"]}
          onSelect={(option) => handleDropDownSelect('Meal Type', option)}
        />
        <DropDown
          label="Serving Size"
          options={[1, 2, 3, 4, 5, "Any"]}
          onSelect={(option) => handleDropDownSelect('Serving Size', option)}
        />
        <DropDown
          label="Cuisine"
          options={["Italian", "Indian", "French", "Spanish", "Any"]}
          onSelect={(option) => handleDropDownSelect('Cuisine', option)}
        />
      </div>

      {loading && (
        <div className="mt-4 text-gray-600">{loadingMessage}</div>
      )}
    </div>
  );
}
