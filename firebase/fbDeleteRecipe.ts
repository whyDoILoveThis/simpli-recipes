import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById";

export const fbDeleteRecipe = async (userId: string, recipeId: string) => {
  try {
    const userRef = doc(db, "users", userId);

    const user = await fbGetUserById(userId);
    const recipeToDelete = user?.recipes?.find((r) => r.uid === recipeId);

    if (!recipeToDelete) throw new Error("Recipe not found");

    await updateDoc(userRef, {
      recipes: arrayRemove(recipeToDelete), // Remove the recipe
    });

    console.log("Recipe deleted successfully!");
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
};
