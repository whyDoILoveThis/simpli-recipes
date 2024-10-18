import { doc, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById";

export const fbDeleteRecipe = async (userId: string, recipeId: string) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    const userRef = doc(db, "users", userId)

    const user = await fbGetUserById(userId);
    const recipeToDelete = user?.recipes?.find((recipeUid) => recipeUid === recipeId);

    if (!recipeRef) throw new Error("Recipe not found");

    deleteDoc(recipeRef);

    await updateDoc(userRef, {
      recipes: arrayRemove(recipeToDelete), // Remove the recipe
    });

    console.log("Recipe deleted successfully!");
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};
