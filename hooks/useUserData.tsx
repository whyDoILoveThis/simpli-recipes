import { useEffect, useState } from "react";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { fbSaveUser } from "@/firebase/fbSaveUser";
import { useAuth, useUser } from "@clerk/nextjs";

// Define the hook to handle user fetching and saving
export const useUserData = () => {
  const { userId } = useAuth();
  const { user } = useUser();

  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Fetch user data function (made reusable for refetch)
  const getUser = async () => {
    if (!userId) {
      setLoadingUser(false);
      return;
    }

    try {
      setLoadingUser(true);
      const fetchedUser = await fbGetUserById(userId); // Fetch user

      if (fetchedUser) {
        setDbUser(fetchedUser); // Set user if found
      } else {
        setIsSavingUser(true); // Start saving user process

        await fbSaveUser({
          userId,
          fullName: user?.fullName || null,
          email: user?.emailAddresses[0]?.emailAddress || null,
          photoUrl: user?.imageUrl || null,
        });

        const newUser = await fbGetUserById(userId); // Re-fetch after saving
        setDbUser(newUser); // Update state with new user
        setIsSavingUser(false); // Stop saving process
      }
    } catch (error) {
      console.error("Error fetching or saving user:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    getUser();
  }, [userId, user]);

  // Handle userId becoming null
  useEffect(() => {
    if (!userId) setDbUser(null);
  }, [userId]);

  // Expose the refetchUser function
  const refetchUser = async () => {
    await getUser();
  };

  return { dbUser, loadingUser, isSavingUser, refetchUser }; // Added refetchUser to the return object
};
