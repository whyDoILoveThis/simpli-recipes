import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById";

export const fbUpdateRecipe = async (userId: string, updatedRecipe: Recipe) => {
  try {
    if(!updatedRecipe.uid) {return}
    // Reference to the specific recipe document in the recipes collection
    const recipeRef = doc(db, "recipes", updatedRecipe.uid);
    const userRef = doc(db, "users", userId);

    // Check if the recipe exists in the user's recipe list
    const user = await fbGetUserById(userId);
    const recipeExists =  user?.recipes?.includes(updatedRecipe.uid);

    if (!recipeExists) throw new Error("Recipe not found in user's list");

    // Update the recipe document in the `recipes` collection
    await updateDoc(recipeRef, {
      ...updatedRecipe,  // Update the recipe with new values
      updatedAt: new Date(),  // Set an updated timestamp if needed
    });

    console.log("Recipe updated successfully!");
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};
