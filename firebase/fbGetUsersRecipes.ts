// firebaseFunctions.ts
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fbGetUsersRecipes = async (recipeUids: string[]): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];

  try {
    if (recipeUids.length === 0) return recipes; // Return empty if no UIDs are provided

    // Query Firestore for recipes where creatorUid is in the provided array
    const q = query(collection(db, "recipes"), where("uid", "in", recipeUids));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const recipe: Recipe = {
        uid: doc.id,
        creatorUid: data.creatorUid,
        title: data.title,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        notes: data.notes || '',
        photoUrl: data.photoUrl || '',
        category: data.category || 'other',
        steps: data.steps || [],
        ingredients: data.ingredients || [],
        totalTime: data.totalTime || '',
        totalTimeTemp: data.totalTimeTemp || 0,
        comments: data.comments || [],
      };
      recipes.push(recipe);
    });

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error; // Throw error for handling in the component
  }
};
