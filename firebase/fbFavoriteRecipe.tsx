import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById";

export const fbFavoriteRecipe = async (
  userId: string,
  recipeId: string,
  addToFavorites: boolean // NEW parameter: true = favorite, false = unfavorite
) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    const userRef = doc(db, "users", userId);

    // Check if the recipe exists
    const recipeSnap = await getDoc(recipeRef);
    if (!recipeSnap.exists()) {
      throw new Error("Recipe not found");
    }

    const recipeData = recipeSnap.data();
    const user = await fbGetUserById(userId);
    const isAlreadyFavorite = user?.favoriteRecipes?.includes(recipeId);

    if (addToFavorites) {
      // ✅ Add to favorites
      if (isAlreadyFavorite) {
        console.log("Recipe is already in favorites.");
        return;
      }

      await updateDoc(userRef, {
        favoriteRecipes: arrayUnion(recipeId),
      });

      await updateDoc(recipeRef, {
        timesFavorited: (recipeData?.timesFavorited || 0) + 1,
      });

      console.log("Recipe added to favorites successfully!");
    } else {
      // ❌ Remove from favorites
      if (!isAlreadyFavorite) {
        console.log("Recipe is not in favorites.");
        return;
      }

      await updateDoc(userRef, {
        favoriteRecipes: arrayRemove(recipeId),
      });

      await updateDoc(recipeRef, {
        timesFavorited: Math.max((recipeData?.timesFavorited || 1) - 1, 0),
      });

      console.log("Recipe removed from favorites successfully!");
    }
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
};
