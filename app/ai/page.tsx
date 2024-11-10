import RecipeInputForm from "@/components/AI/RecipeInputForm";
import React from "react";

const Page = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mt-4 text-center">
        🍽️ Recipe Generator
      </h1>
      <RecipeInputForm />
    </div>
  );
};

export default Page;
