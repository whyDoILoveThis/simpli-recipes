import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Assuming you have the db instance from Firebase
import { fbGetUserById } from "@/firebase/fbGetUserById";

// ❌ Remove a friend function
export const fbRemoveFriend = async (userId: string, friendId: string) => {
  try {
    const userRef = doc(db, "users", userId); // Get reference to current user
    const friendRef = doc(db, "users", friendId); // Get reference to friend

    // Fetch both users to verify they are friends
    const user = await fbGetUserById(userId);
    const friend = await fbGetUserById(friendId);

    if (!user || !friend) throw new Error("One or both users not found.");

    // Check if they are actually friends before proceeding
    if (user.friends && !user.friends.includes(friendId) || friend.friends && !friend.friends.includes(userId)) {
      throw new Error("Users are not friends.");
    }

    // 🛠 Remove each other from the friends list
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),  // Remove friend from user's friends list
    });

    await updateDoc(friendRef, {
      friends: arrayRemove(userId),  // Remove user from friend's friends list
    });

    alert("Friend removed successfully!");
  } catch (error) {
    console.error("Error removing friend:", error);
  }
};
