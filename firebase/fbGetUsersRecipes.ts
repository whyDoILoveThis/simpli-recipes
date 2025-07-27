// firebaseFunctions.ts
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const fbGetUsersRecipes = async (recipeUids: string[]): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];

  try {
    if (recipeUids.length === 0) return recipes;

    const chunks = chunkArray(recipeUids, 30);

    // Run all queries in parallel for speed
    const promises = chunks.map(chunk => {
      const q = query(collection(db, "recipes"), where("uid", "in", chunk));
      return getDocs(q);
    });

    const snapshots = await Promise.all(promises);

    snapshots.forEach(querySnapshot => {
      querySnapshot.forEach(doc => {
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
    });

    return recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
