'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("/api").then(
      res => res.json()
    ).then(
      data => {
        setIngredients(data.ing);
      }
    );
  }, []);

  const handleAddIngredient = () => {
    if (inputValue.trim() !== "") {
      fetch("/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ingredient: inputValue.trim() })
      }).then(
        res => res.json()
      ).then(
        data => {
          setIngredients(data.ing);
          setInputValue("");
        }
      );
    }
  };

  const handleReset = () => {
    fetch("/api/reset", {
      method: "POST"
    }).then(
      res => res.json()
    ).then(
      data => {
        setIngredients(data.ing);
      }
    );
  };

  return (
<div className="text-center font-sans p-5">
  <h1 className="text-4xl my-5">MEALMATCH</h1>
  <h2 className="text-2xl my-5">Welcome to MealMatch, input your ingredients:</h2>
  <div className="mt-5">
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Enter an ingredient"
      className="p-2 text-base w-72 mr-2 border border-gray-300 rounded"
    />
    <button
      onClick={handleAddIngredient}
      className="p-2 px-5 text-base bg-green-600 text-white rounded ml-2"
    >
      Add
    </button>
    <button
      onClick={handleReset}
      className="p-2 px-5 text-base bg-red-600 text-white rounded ml-2"
    >
      Reset
    </button>
  </div>
  <div className="mt-5">
    {ingredients.map((ingredient, i) => (
      <div
        key={i}
        className="my-2 p-2 border border-gray-300 rounded inline-block w-52 text-left"
      >
        {ingredient}
      </div>
    ))}
  </div>
</div>

  );
}
