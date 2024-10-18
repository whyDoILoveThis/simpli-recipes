// firebaseFunctions.ts
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";




export const fbGetAllUsers = async (): Promise<User[]> => {
  const users: User[] = [];

  try {
    const q = query(collection(db, `users`));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const user: User = {
        userId: data.userId,
        createdAt: data.createdAt,
        fullName: data.fullName,
        fullNameLower: data.fullNameLower,
        email: data.email,
        photoUrl: data.photoUrl,
        friendRequests: data.friendRequests || [],
        sentFriendRequests: data.sentFriendRequests || [],
        friends: data.friends|| []

      };
      users.push(user);
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Throw error for handling in the component
  }
};
