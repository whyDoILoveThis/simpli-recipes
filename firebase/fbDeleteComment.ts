import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firestore db instance

export const fbDeleteComment = async (recipeId: string, commentUid: string) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);

    // Fetch the recipe document to get the full comment object by UID
    const recipeSnap = await getDoc(recipeRef);
    if (!recipeSnap.exists()) throw new Error("Recipe not found");

    const recipeData = recipeSnap.data();
    const commentToDelete = recipeData?.comments.find((comment: Comment) => comment.commentUid === commentUid);

    if (!commentToDelete) {
      console.log("Comment not found or already deleted.");
      return;
    }

    // Remove the specific comment using arrayRemove with the exact object
    await updateDoc(recipeRef, {
      comments: arrayRemove(commentToDelete),
    });

    console.log("Comment deleted successfully!");
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};
