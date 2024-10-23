"use client";
import RecipeForm from "@/components/RecipeForm";
import { useRecipeStore } from "@/hooks/userRecipeStore";
import { useUserStore } from "@/hooks/useUserStore";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { v4 } from "uuid";
import { fbAddRecipe } from "@/firebase/fbAddRecipe";

const Page = () => {
  const router = useRouter();
  const { dbUser, refetchUser } = useUserStore();
  const { userId } = useAuth();
  const { recipes, setRecipes } = useRecipeStore(); // Local state for recipes

  const [newRecipeData, setNewRecipeData] = useState<Partial<Recipe>>({});

  // 🛠️ Ensure no empty submission
  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeData.title || newRecipeData.title.trim() === "") {
      alert("Please provide a recipe title."); // Simple validation
      return;
    }

    if (dbUser?.userId && userId) {
      const newRecipe: Recipe = {
        uid: v4(), // Create a unique ID for the new recipe
        creatorUid: userId,
        title: newRecipeData.title || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: newRecipeData.notes || "",
        photoUrl: newRecipeData.photoUrl || "",
        category: newRecipeData.category || "other",
        steps: newRecipeData.steps || [],
        ingredients: newRecipeData.ingredients || [],
        totalTime: newRecipeData.totalTime || "",
        totalTimeTemp: newRecipeData.totalTimeTemp || 0,
        comments: [],
      };

      await fbAddRecipe(dbUser.userId, newRecipe);

      setRecipes([...recipes, newRecipe]); // Update local state
      setNewRecipeData({}); // Reset form after successful add
      refetchUser();
      router.push("/");
    }
  };
  return (
    <div>
      {" "}
      <RecipeForm
        mode="add"
        recipeData={newRecipeData} // initial new recipe data state
        setNewRecipeData={setNewRecipeData}
        onSubmit={handleAddRecipe}
      />
    </div>
  );
};

export default Page;
