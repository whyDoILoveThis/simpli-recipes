import { fbGetUserById } from "@/firebase/fbGetUserById";
import {
  fbAcceptFriendRequest,
  fbDeleteSentRequest,
  fbRejectFriendRequest,
  fbRemoveFriendRequest,
} from "@/firebase/fbManageFriendRequest";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useSentRequests } from "@/hooks/useSentRequests";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BsThreeDots } from "react-icons/bs";
import RequestStatus from "./ui/RequestStatus";
import MyDropdownTrigger from "./ui/MyDropdownTrigger";
import DateAndTime from "./ui/DateAndTime";
import RequestCard from "./ui/RequestCard";

const SentRequests = () => {
  const { sentFriendRequests, loadingRequests, refetchFriendRequests } =
    useFriendRequests();
  const { userId } = useAuth();
  const { refetchUser } = useUserStore();
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [localRequests, setLocalRequests] = useState(sentFriendRequests || []); // Track requests locally
  // Fetch users for all the friend requests
  useEffect(() => {
    const fetchUsers = async () => {
      if (!sentFriendRequests || sentFriendRequests.length === 0) {
        setLoadingUsers(false);
        return;
      }

      try {
        const userFetches = sentFriendRequests.map(async (request) => {
          const user = await fbGetUserById(request.userUid); // Fetch user by ID
          return { userUid: request.userUid, user };
        });

        const userResults = await Promise.all(userFetches); // Wait for all fetches to complete
        const usersMap: { [key: string]: User | null } = {};

        userResults.forEach((result) => {
          usersMap[result.userUid] = result.user; // Store user even if it's null
        });

        setUsers(usersMap); // Store users by their requesterId
        sentFriendRequests && setLocalRequests(sentFriendRequests); // Initialize local requests
      } catch (error) {
        console.error("Error fetching users for requests:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers(); // Fetch users on component mount
  }, [sentFriendRequests]);

  const handleAccept = async (requesterId: string) => {
    if (!userId) return;

    try {
      await fbAcceptFriendRequest(userId, requesterId);
      // Update local state after accepting the request
      setLocalRequests((prev) =>
        prev.filter((request) => request.userUid !== requesterId)
      );
      // Optional: You can also trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleStop = async (requesterId: string, status: string) => {
    if (!userId) return;

    try {
      await fbDeleteSentRequest(requesterId, userId, status);
      // Update local state after rejecting the request
      await refetchFriendRequests();
      sentFriendRequests && setLocalRequests(sentFriendRequests);
      // Optional: Trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleDelete = async (requesterId: string, status: string) => {
    if (!userId) return;

    try {
      await fbDeleteSentRequest(requesterId, userId, status);
      // Update local state after rejecting the request
      await refetchFriendRequests();
      sentFriendRequests && setLocalRequests(sentFriendRequests);
      // Optional: Trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  if (loadingRequests || loadingUsers)
    return <div>Loading friend requests...</div>;

  if (sentFriendRequests && sentFriendRequests !== localRequests) {
    setLocalRequests(sentFriendRequests);
  }
  return (
    <div>
      {" "}
      {localRequests && localRequests.length > 0 ? (
        localRequests.map((request, index) => {
          const user = users[request.userUid];
          return (
            <RequestCard
              index={index}
              uid={request.userUid}
              request={request}
              handleStop={handleStop}
              handleDelete={handleDelete}
              user={user}
            />
          );
        })
      ) : (
        <p>No sent requests found.</p>
      )}
    </div>
  );
};

export default SentRequests;
