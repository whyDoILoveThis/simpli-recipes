// store/recipeStore.ts
import { create } from "zustand";

interface RecipeState {
  recipes: Recipe[];
  setRecipes: (newRecipes: Recipe[]) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],

  setRecipes: (newRecipes) => set({ recipes: newRecipes }),
}));
