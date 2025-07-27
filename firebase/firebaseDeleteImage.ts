// firebaseStorage.ts
import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig"; // Your Firebase configuration


export const fbDeleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the full download URL
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";
    const storageBucket = storage.app.options.storageBucket;

    if (!storageBucket || !imageUrl.startsWith(baseUrl)) {
      throw new Error("Invalid image URL or missing storage bucket.");
    }

    // This regex extracts the path after `/o/` and before `?`
    const encodedPath = imageUrl.split(`/o/`)[1]?.split(`?`)[0];
    if (!encodedPath) throw new Error("Could not extract image path from URL");

    // Decode the %2F encoded slashes (Firebase uses URL-safe encoding)
    const imagePath = decodeURIComponent(encodedPath);

    // Create a reference to the file
    const imageRef = ref(storage, imagePath);

    // Delete the file
    await deleteObject(imageRef);

    console.log("✅ Image deleted successfully from Firebase Storage");
  } catch (error) {
    console.error("❌ Error deleting image from Firebase Storage:", error);
    throw error;
  }
};