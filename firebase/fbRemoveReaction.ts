import { db } from "./firebaseConfig"; // your Firebase config
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const fbRemoveReaction = async (
  userId: string, 
  recipeId: string, 
  commentUid: string, 
  theReaction: Reaction
) => {
  const recipeRef = doc(db, "recipes", recipeId);
  const recipeSnapshot = await getDoc(recipeRef);

  if (!recipeSnapshot.exists()) {
    console.error("Recipe does not exist!");
    return;
  }

  const recipeData = recipeSnapshot.data();
  const comments = recipeData?.comments || [];

  // Locate the specific comment
  const commentIndex = comments.findIndex((comment: any) => comment.commentUid === commentUid);
  
  if (commentIndex === -1) {
    console.error("Comment not found!");
    return;
  }

  // Remove the old reaction if it exists
  const existingReactions: Reaction[] = comments[commentIndex].reactions || [];
  const updatedReactions = existingReactions.filter(
    (reaction) => reaction.userUid !== userId
  );

  // Add the new reaction
  updatedReactions.filter((r)=> r.reactionUid !== theReaction.reactionUid)

  // Update the comment with the new reactions
  comments[commentIndex].reactions = updatedReactions;

  // Update the recipe document with the modified comments array
  await updateDoc(recipeRef, { comments });
};
