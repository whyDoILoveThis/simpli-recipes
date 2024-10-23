// firebaseFunctions.ts
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

export const fbGetAllRecipes = async (): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];

  try {
    const q = query(collection(db, `recipes`));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Recipe;
      const recipe: Recipe = data;
      recipes.push(recipe);
    });

    return recipes;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Throw error for handling in the component
  }
};
