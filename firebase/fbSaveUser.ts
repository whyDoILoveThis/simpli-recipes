// fbCreateBlog.ts
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

interface params {
    userId: MaybeString;
    fullName: MaybeString;
    email: MaybeString;
    photoUrl: MaybeString;
}

export async function fbSaveUser({
  userId,
  fullName,
  email,
  photoUrl,
}: params) {
 if(userId && fullName){   
     const docId = userId;
 try {
    const docRef = doc(db, `users`, docId);
    await setDoc(docRef, {
      userId: userId,
      createdAt: new Date(),
      fullName: fullName,
      fullNameLower: fullName.toLowerCase(),
      email: email,
      photoUrl: photoUrl,
      friendRequests: [],
      sentFriendRequests: [],
      friends: []
    });
    console.log("Blog created successfully!");
  } catch (error) {
    console.error("Error creating blog:", error);
    // Handle error as needed
  }}
}
