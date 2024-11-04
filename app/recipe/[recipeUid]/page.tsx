"use client";
import RecipeCardOpen from "@/components/ui/RecipeCardOpen";
import { fbGetRecipeById } from "@/firebase/fbGetRecipeById";
import React, { useEffect, useState } from "react";

const Page = ({ params: { recipeUid } }: { params: { recipeUid: string } }) => {
  const [recipe, setRecipe] = useState<Recipe | null>();
  useEffect(() => {
    const g = async () => {
      setRecipe(await fbGetRecipeById(recipeUid));
    };
    g();
  }, []);

  console.log(recipe);

  return (
    <div>
      {recipe && <RecipeCardOpen showPageLink={false} recipe={recipe} />}
    </div>
  );
};

export default Page;
