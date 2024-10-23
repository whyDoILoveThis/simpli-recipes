import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById";

export const fbFavoriteRecipe = async (userId: string, recipeId: string) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    const userRef = doc(db, "users", userId);

    // Check if the recipe exists
    const recipeSnap = await getDoc(recipeRef);
    if (!recipeSnap.exists()) {
      throw new Error("Recipe not found");
    }

    const recipeData = recipeSnap.data();

    // Fetch user data to check if the recipe is already in favorites
    const user = await fbGetUserById(userId);
    const isAlreadyFavorite = user?.favoriteRecipes?.includes(recipeId);

    if (isAlreadyFavorite) {
      console.log("Recipe is already in favorites.");
      return;
    }

    // Add the recipe to user's favorites
    await updateDoc(userRef, {
      favoriteRecipes: arrayUnion(recipeId),
    });

    // Increment the timesFavorited count in the recipe
    await updateDoc(recipeRef, {
      timesFavorited: (recipeData?.timesFavorited || 0) + 1,
    });

    console.log("Recipe added to favorites successfully!");
  } catch (error) {
    console.error("Error favoriting the recipe:", error);
  }
};
