import { fbGetUserById } from "@/firebase/fbGetUserById";
import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { uuid } from 'uuidv4';


export const fbAddRecipe = async (userId: string, recipe: Recipe) => {
    console.log(recipe);
    
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      recipes: arrayUnion(recipe.uid), // Add the recipe to the recipes array
    });

    if(userId && recipe.uid){   
    const docId = recipe.uid
  
     const docRef = doc(db, `recipes`, docId);
     await setDoc(docRef, recipe);

    console.log("Recipe added successfully!");
    }
  
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
}

