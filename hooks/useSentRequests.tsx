import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore"; // Adjust if using Firestore
import { db } from "@/firebase/firebaseConfig"; // Your Firestore initialization
import { useAuth } from "@clerk/nextjs";

// Hook to get sent requests for the current user
export const useSentRequests = () => {
  const { userId } = useAuth();
  const [mySentRequests, setMySentRequests] = useState<string[]>([]);
  const [loadingSentRequests, setLoadingSentRequests] = useState<boolean>(true);

  const fetchSentRequests = async () => {
    if (!userId) return;
    try {
      setLoadingSentRequests(true);
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const sentRequestsData = userData?.sentFriendRequests || []; // Assuming the sent requests are stored here
        const requestIds = sentRequestsData.map((req: any) => req.userUid); // Adjust based on your structure
        setMySentRequests(requestIds);
      }
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    } finally {
      setLoadingSentRequests(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchSentRequests();
  }, [userId]);

  const refetchSentRequests = async () => {
    fetchSentRequests();
  };

  return { mySentRequests, loadingSentRequests, refetchSentRequests };
};
