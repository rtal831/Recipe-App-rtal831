import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
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
      <div className="app-container">
        <h1 className="title">MEALMATCH</h1>
        <h2 className="header">Welcome to MealMatch, input your ingredients:</h2>
        <div className="input-container">
          <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter an ingredient"
              className="input-box"
          />
          <button onClick={handleAddIngredient} className="add-button">Add</button>
          <button onClick={handleReset} className="reset-button">Reset</button>
        </div>
        <div className="ingredient-list">
          {ingredients.map((ingredient, i) => (
              <div key={i} className="ingredient-item">{ingredient}</div>
          ))}
        </div>
      </div>
  );
}

export default App;
