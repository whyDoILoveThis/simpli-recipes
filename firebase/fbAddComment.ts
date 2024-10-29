import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance
import { v4 } from 'uuid';


export const fbAddComment = async (recipeId: string, userId: string, commentText: string, parentCommentId?: string ) => {
    
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    const newComment = {
      commentUid: v4(),
      userUid: userId,
      comment: commentText,
      parentCommentId: parentCommentId || null,
      postedAt: new Date(),
    };

    await updateDoc(recipeRef, {
      comments: arrayUnion(newComment), // Add the recipe to the recipes array
    });

    if(recipeId && userId && commentText){   
      console.log("Comment added successfully!");
    }
    else {console.log("Missing some data from comment could not add");
    }
  
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

