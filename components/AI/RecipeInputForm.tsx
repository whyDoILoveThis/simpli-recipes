"use client";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import SendIcon from "../icons/SendIcon";

const RecipeInputForm = () => {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a recipe idea.");
      return;
    }

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("An error occurred while fetching the recipe.");
    }
  };

  console.log(recipe);

  return (
    <div>
      <form className="flex gap-1 items-end m-4" onSubmit={handleSubmit}>
        <Textarea
          className="text-xl font-bold placeholder:text-opacity-40"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your recipe idea here..."
        ></Textarea>
        <button className="btn btn-ghost btn-round text-2xl" type="submit">
          <SendIcon />
        </button>
      </form>
      {recipe && (
        <div>
          <h2>{recipe.title}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((ing: any, index: number) => (
              <li key={index}>
                {ing.quantity} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>
          <h3>Steps:</h3>
          <ol>
            {recipe.steps.map((step: any, index: number) => (
              <li key={index}>
                <b>Step {index + 1}</b> <br /> {step.instruction}
              </li>
            ))}
          </ol>
          <h3>Notes:</h3>
          <p>{recipe.notes}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeInputForm;
