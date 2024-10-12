import { db } from "@/firebase/firebaseConfig"; // Ensure the correct path to your firebaseConfig
import { doc, getDoc } from "firebase/firestore";



export const fbGetUserById = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User; // Ensure casting to User type
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Throw error for handling in the component
  }
};
