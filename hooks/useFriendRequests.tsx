import { useEffect, useState } from "react";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { useAuth } from "@clerk/nextjs";

// Define the hook to fetch friend requests and sent friend requests
export const useFriendRequests = () => {
  const { userId } = useAuth(); // Fetch the current user's ID

  const [friendRequests, setFriendRequests] = useState<FriendRequest[] | null>(
    null
  );
  const [sentFriendRequests, setSentFriendRequests] = useState<
    SentFriendRequest[] | null
  >(null);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Fetch friend requests and sent friend requests
  const fetchRequests = async () => {
    if (!userId) {
      setLoadingRequests(false); // Stop loading if no userId
      return;
    }

    try {
      setLoadingRequests(true); // Start loading

      // Fetch the user by userId
      const fetchedUser = await fbGetUserById(userId);

      // If the user exists, set the friend requests and sent friend requests
      if (fetchedUser) {
        setFriendRequests(fetchedUser.friendRequests || []);
        setSentFriendRequests(fetchedUser.sentFriendRequests || []);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoadingRequests(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchRequests(); // Call the function inside useEffect
  }, [userId]);

  const refetchFriendRequests = async () => {
    await fetchRequests();
  };

  return {
    friendRequests,
    sentFriendRequests,
    loadingRequests,
    refetchFriendRequests,
  };
};
