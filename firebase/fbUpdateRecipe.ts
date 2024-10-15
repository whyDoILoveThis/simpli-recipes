import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { fbGetUserById } from "./fbGetUserById";

export const fbUpdateRecipe = async (userId: string, updatedRecipe: Recipe) => {
  try {
    const userRef = doc(db, "users", userId);

    // First, remove the old recipe
    const user = await fbGetUserById(userId);
    const oldRecipe = user?.recipes?.find((r) => r.uid === updatedRecipe.uid);

    if (!oldRecipe) throw new Error("Recipe not found");

    await updateDoc(userRef, {
      recipes: arrayRemove(oldRecipe), // Remove the old recipe
    });

    // Then, add the updated recipe
    await updateDoc(userRef, {
      recipes: arrayUnion(updatedRecipe), // Add the updated recipe back
    });

    console.log("Recipe updated successfully!");
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};
