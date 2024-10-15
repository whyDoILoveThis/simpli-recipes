import { fbGetUserById } from "@/firebase/fbGetUserById";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance

export const fbAddRecipe = async (userId: string, recipe: Recipe) => {
    console.log(recipe);
    
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      recipes: arrayUnion(recipe), // Add the recipe to the recipes array
    });

    console.log("Recipe added successfully!");
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};
