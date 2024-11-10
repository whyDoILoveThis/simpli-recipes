"use client";
import React, { useEffect } from "react";
import RecipeCardListWithSearchFiltering from "./Feed/RecipeCardListWithSearchFiltering";
import { useUserStore } from "@/hooks/useUserStore";

const MyFavorites = () => {
  const { refetchUser } = useUserStore();

  return (
    <div>
      <h2 className="text-center font-bold mb-6 mt-8">My Favorites</h2>
      <div className="flex justify-center">
        <RecipeCardListWithSearchFiltering filterFavorites={true} />
      </div>
    </div>
  );
};

export default MyFavorites;
