"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import SendIcon from "../icons/SendIcon";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth, useUser } from "@clerk/nextjs";
import { v4 } from "uuid";
import { fbAddRecipe } from "@/firebase/fbAddRecipe";
import LoaderSpinner from "../ui/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import SaveIcon from "../icons/SaveIcon";
import fetchRecipeImage from "@/lib/fetchRecipeImage";

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
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loadingAiRes, setLoadingAiRes] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const [diableSendBtn, setDisableSendBtn] = useState(false);
  const [imgSearchIndex, setImgSearchIndex] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const { dbUser, fetchUser } = useUserStore();
  const { user } = useUser();
  const { userId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableSendBtn(true);
    if (savingRecipe) return;
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
      setLoadingAiRes(false);
      setDisableSendBtn(false);
    } catch (error) {
      setLoadingAiRes(false);
      setDisableSendBtn(false);
      console.error("❌ Error:", error);
      alert("An error occurred while fetching the recipe.");
    }
  };

  useEffect(() => {
    const g = async () => {
      if (recipe.title) {
        setImageUrl(await fetchRecipeImage(recipe.title, imgSearchIndex));
      }
    };
    g();
  }, [recipe]);

  useEffect(() => {
    if (user && userId) {
      fetchUser(userId, user);
    }
  }, []);

  useEffect(() => {
    if (user && userId) {
      fetchUser(userId, user);
    }
  }, [user, userId]);

  // 🛠️ Ensure no empty submission
  const handleAddRecipe = async (e: React.FormEvent) => {
    // Define the types for the recipe components

    console.log(dbUser);
    e.preventDefault();
    if (recipeSaved) return;

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

      console.log(imageUrl);

      const newRecipe: Recipe = {
        uid: v4(), // Create a unique ID for the new recipe
        creatorUid: userId,
        title: recipe.title || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: recipe.notes || "",
        photoUrl: imageUrl || "",
        category: recipe.category || "other",
        steps: stepInstructions || [],
        ingredients: formattedIngredients || [],
        totalTime: recipe.totalCookTimeInMinutes || "",
        totalTimeTemp: recipe.totalTimeTemp || 0,
        comments: [],
      };
      console.log(newRecipe);

      await fbAddRecipe(dbUser.userId, newRecipe);
      setSavingRecipe(false);
      setRecipeSaved(true);
      toast({
        title: "Recipe Saved 🙏",
        variant: "green",
      });
    } else {
      alert("missing userid");
      setRecipeSaved(false);
      setSavingRecipe(false);
    }
  };

  const handleChangeImg = async () => {
    setImageUrl(await fetchRecipeImage(recipe.title, imgSearchIndex + 1));
    setImgSearchIndex(imgSearchIndex + 1);
  };

  console.log(recipe);

  return (
    <div className="p-4 pb-8">
      <form
        className="flex gap-1 items-end m-4"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="w-full flex items-end p-2 rounded-2xl bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10">
          <textarea
            className="text-xl min-h-[150px] font-bold focus:outline-none placeholder:text-opacity-40 w-full bg-transparent"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your recipe idea here..."
          ></textarea>
          <button
            disabled={diableSendBtn}
            style={{ cursor: `${loadingAiRes ? "default" : "pointer"}` }}
            className={`btn btn-ghost btn-round text-2xl`}
            onClick={() => {
              setLoadingAiRes(true);
              setSavingRecipe(false);
              setRecipeSaved(false);
            }}
            type="submit"
          >
            {loadingAiRes ? <LoaderSpinner /> : <SendIcon />}
          </button>
        </div>
      </form>
      {recipe && !loadingAiRes && (
        <div className="flex flex-col items-center">
          <form
            className="max-w-[350px] bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10 p-2 rounded-xl flex flex-col justify-end"
            onSubmit={handleAddRecipe}
          >
            {
              <div>
                <img src={imageUrl && imageUrl} alt="stock image" />
                <button type="button" onClick={handleChangeImg}>
                  🔃
                </button>
              </div>
            }
            <h2 className="text-center font-bold">{recipe.title}</h2>
            <ul className="mt-4 p-2 bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10 rounded-lg">
              <h3 className="font-bold text-lg">Ingredients:</h3>
              {recipe.ingredients.map((ing: any, index: number) => (
                <li key={index}>
                  {ing.quantity} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
            <ol className="flex flex-col gap-6 mt-4 p-4 bg-black bg-opacity-15 dark:bg-white dark:bg-opacity-10 rounded-lg">
              {recipe.steps.map((step: any, index: number) => (
                <li key={index}>
                  <b>Step{index + 1}</b> <br /> {step.instruction}
                </li>
              ))}
            </ol>
            {recipe.notes && (
              <div>
                <h3 className="text-lg font-bold">Notes:</h3>
                <p>{recipe.notes}</p>
              </div>
            )}
            <Button
              variant={"green"}
              type="submit"
              className={`m-4 ${
                savingRecipe || (recipeSaved && "cursor-default")
              }`}
              onClick={() => {
                !recipeSaved && setSavingRecipe(true);
              }}
            >
              {savingRecipe ? (
                <LoaderSpinner />
              ) : recipeSaved && !savingRecipe ? (
                "Saved ✔"
              ) : (
                <div className="flex items-center gap-1 text-xl">
                  <SaveIcon />
                  Save
                </div>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RecipeInputForm;
