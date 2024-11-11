"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import SendIcon from "../icons/SendIcon";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { v4 } from "uuid";
import { fbAddRecipe } from "@/firebase/fbAddRecipe";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Step {
  step_number: number;
  instruction: string;
}

const RecipeInputForm = () => {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState<any | null>(null);
  const { dbUser, fetchUser } = useUserStore();
  const { user } = useUser();
  const { userId } = useAuth();

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

  useEffect(() => {
    if (user && userId) {
      fetchUser(userId, user);
    }
  }, []);

  // 🛠️ Ensure no empty submission
  const handleAddRecipe = async (e: React.FormEvent) => {
    // Define the types for the recipe components

    console.log(dbUser);
    e.preventDefault();

    if (dbUser?.userId && userId) {
      // 1️⃣ Extract steps as an array of instructions
      const stepInstructions: string[] = recipe.steps.map(
        (step: Step) => step.instruction
      );

      // 2️⃣ Combine ingredient properties into a single string
      const formattedIngredients: string[] = recipe.ingredients.map(
        (ingredient: Ingredient) => {
          return `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;
        }
      );

      const newRecipe: Recipe = {
        uid: v4(), // Create a unique ID for the new recipe
        creatorUid: userId,
        title: recipe.title || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: recipe.notes || "",
        photoUrl: recipe.photoUrl || "",
        category: recipe.category || "other",
        steps: stepInstructions || [],
        ingredients: formattedIngredients || [],
        totalTime: recipe.totalCookTimeInMinutes || "",
        totalTimeTemp: recipe.totalTimeTemp || 0,
        comments: [],
      };
      console.log(newRecipe);

      await fbAddRecipe(dbUser.userId, newRecipe);
    } else {
      alert("missing userid");
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
          <button onClick={handleAddRecipe}>Save Recipe</button>
        </div>
      )}
    </div>
  );
};

export default RecipeInputForm;
