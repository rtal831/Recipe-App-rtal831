import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import pasta from '../../img/pasta.png';
import pizza from '../../img/pizza.png';
import vegan from '../../img/vegan.png';
import desserts from '../../img/dessert.png';
import breakfast from '../../img/breakfast.png';
import { generateRecipe } from '../../lib/api';

const categories = [
  { title: 'Pasta', img: pasta, cuisine: 'Italian' },
  { title: 'Pizza', img: pizza, cuisine: 'Italian' },
  { title: 'Vegan', img: vegan, cuisine: 'Any' },
  { title: 'Desserts', img: desserts, cuisine: 'Any' },
  { title: 'Breakfast', img: breakfast, cuisine: 'Any' },
];

const PopularCategories = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading recipes, please wait');
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (loading) {
      const messages = ['Loading recipes, please wait', 'Loading recipes, please wait.', 'Loading recipes, please wait..', 'Loading recipes, please wait...'];
      let index = 0;
      timer = setInterval(() => {
        setLoadingMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, 500);
    } else {
      setLoadingMessage('Loading recipes, please wait');
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleCategoryClick = async (category) => {
    setLoading(true);
    const selectedCuisine = category.cuisine;
    const selectedMealType = category.title;
    const selectedServingSize = 'Any';
    const dietaryPreferences = 'none';
    const ingredients = 'Any';
    try {
      // Call the API to generate recipes based on the selected category
      const data = await generateRecipe(ingredients, selectedCuisine, dietaryPreferences, selectedMealType, selectedServingSize);
      // Clear and store generated recipes in backend
      await fetch('http://localhost:5000/api/server/generated-recipes', {
        method: 'DELETE',
      });
      await fetch('http://localhost:5000/api/server/generated-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipes: data })
      });
      router.push('/result');
    } catch (error) {
      console.error('Error fetching or storing the recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-12">
      <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((category) => (
          <button
            key={category.title} // Use a unique key
            className="flex flex-col items-center p-2 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => handleCategoryClick(category)}
            aria-label={`Select ${category.title} category`}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
              <Image
                src={category.img}
                alt={category.title}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-4 text-lg font-medium">{category.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;
