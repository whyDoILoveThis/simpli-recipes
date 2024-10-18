import { useEffect, useState } from "react";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import {
  fbAcceptFriendRequest,
  fbDeleteFriendRequest,
  fbRejectFriendRequest,
} from "@/firebase/fbManageFriendRequest"; // Assuming you have a function to reject
import { useAuth } from "@clerk/nextjs";
import { useUserData } from "@/hooks/useUserData";
import FriendRequests from "./FriendRequests";
import SentRequests from "./SentRequests";
import { useUserFriendsStore } from "@/hooks/useUserFriendsStore";

// Assume you already have a User interface in your type definitions
// No need to redefine User, just handle MaybeString (which could be undefined).

const MyRequests = () => {
  const { userId } = useAuth();
  const { refetchUser } = useUserData();
  const { friends, fetchUserFriends } = useUserFriendsStore();
  const { friendRequests, loadingRequests, refetchFriendRequests } =
    useFriendRequests(); // Assuming you have a way to refetch requests
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [localRequests, setLocalRequests] = useState(friendRequests || []); // Track requests locally
  const [showMySent, setShowMySent] = useState(false);

  // Fetch users for all the friend requests
  useEffect(() => {
    const fetchUsers = async () => {
      if (!friendRequests || friendRequests.length === 0) {
        setLoadingUsers(false);
        return;
      }

      try {
        const userFetches = friendRequests.map(async (request) => {
          const user = await fbGetUserById(request.requesterId); // Fetch user by ID
          return { requesterId: request.requesterId, user };
        });

        const userResults = await Promise.all(userFetches); // Wait for all fetches to complete
        const usersMap: { [key: string]: User | null } = {};

        userResults.forEach((result) => {
          usersMap[result.requesterId] = result.user; // Store user even if it's null
        });

        setUsers(usersMap); // Store users by their requesterId
        setLocalRequests(friendRequests); // Initialize local requests
      } catch (error) {
        console.error("Error fetching users for requests:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers(); // Fetch users on component mount
  }, [friendRequests]);

  const handleAccept = async (requesterId: string) => {
    if (!userId) return;

    try {
      await fbAcceptFriendRequest(userId, requesterId);
      // Update local state after accepting the request
      await refetchFriendRequests();
      friendRequests && setLocalRequests(friendRequests);
      // Optional: You can also trigger a refetch if needed
      // refetchRequests();
      refetchUser();
      fetchUserFriends(userId);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = async (requesterId: string) => {
    if (!userId) return;

    try {
      await fbRejectFriendRequest(userId, requesterId);
      // Update local state after rejecting the request
      await refetchFriendRequests();
      friendRequests && setLocalRequests(friendRequests);
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
      await fbDeleteFriendRequest(userId, requesterId, status);
      // Update local state after rejecting the request
      await refetchFriendRequests();
      friendRequests && setLocalRequests(friendRequests);
      // Optional: Trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  if (loadingRequests || loadingUsers)
    return <div>Loading friend requests...</div>;

  if (friendRequests && friendRequests !== localRequests) {
    setLocalRequests(friendRequests);
  }

  return (
    <div>
      <Select
        defaultValue="recieved"
        onValueChange={(value) => {
          if (value === "sent") {
            setShowMySent(true);
          } else if (value === "recieved") {
            setShowMySent(false);
          }
        }}
      >
        {/*stupid fucking focus ring wtf kind of dumb shit is that.... lol took 20 mins to find this fix*/}
        <SelectTrigger className="w-fit focus:ring-0 rounded-full">
          <SelectValue placeholder="Recieved" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recieved">Recieved</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
        </SelectContent>
      </Select>
      {!showMySent ? (
        <FriendRequests
          localRequests={localRequests}
          handleAccept={handleAccept}
          handleReject={handleReject}
          handleDelete={handleDelete}
          users={users}
        />
      ) : (
        <div>
          <SentRequests />
        </div>
      )}
    </div>
  );
};

export default MyRequests;
