// firebaseFunctions.ts
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export const fbGetComments = async (recipeId: string): Promise<Comment[]> => {

  try {

    // Query Firestore for recipes where creatorUid is in the provided array
    const docRef = doc(db, "recipes", recipeId);

    const querySnapshot = await getDoc(docRef);

      const data = querySnapshot.data();

      if(!data) {
       alert('prblem no add')
      }
     
    

    return data && data.comments;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error; // Throw error for handling in the component
  }
};
