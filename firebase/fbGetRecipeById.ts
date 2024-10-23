import { db } from "@/firebase/firebaseConfig"; // Ensure the correct path to your firebaseConfig
import { doc, getDoc } from "firebase/firestore";



export const fbGetRecipeById = async (recipeId: string): Promise<Recipe | null> => {
  try {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Recipe; // Ensure casting to User type
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Throw error for handling in the component
  }
};
