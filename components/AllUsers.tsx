import { useAllUsersStore } from "@/hooks/useAllUsersStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import AddUserButton from "./icons/AddUserButton";
import ProfileButton from "./icons/ProfileButton";
import { fbSendFriendRequest } from "@/firebase/fbManageFriendRequest";
import { useAuth } from "@clerk/clerk-react";
import { useUserStore } from "@/hooks/useUserStore";
import { useSentRequests } from "@/hooks/useSentRequests";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import UserProfileTag from "./ui/UserProfileTag/UserProfileTag";

const AllUsers = () => {
  const { allUsers, fetchAllUsers } = useAllUsersStore();
  const { refetchUser } = useUserStore();
  const [selectedUserIndex, setSelectedUserIndex] = useState(-999);
  const { userId } = useAuth();
  const [sentRequests, setSentRequests] = useState<string[]>([]); // State to track sent requests
  const { mySentRequests, loadingSentRequests, refetchSentRequests } =
    useSentRequests();
  const { friendRequests, refetchFriendRequests } = useFriendRequests();

  const handleSendFriendRequest = async (recipientId: string) => {
    try {
      if (userId && recipientId) {
        await fbSendFriendRequest(userId, recipientId);
        setSentRequests((prev) => [...prev, recipientId]); // Add recipient to sent requests
        fetchAllUsers();
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    refetchUser();
  };

  useEffect(() => {
    setSentRequests(mySentRequests);
    fetchAllUsers();
  }, [mySentRequests]);
  useEffect(() => {
    fetchAllUsers();
    refetchSentRequests();
    refetchFriendRequests();
    setSentRequests(mySentRequests);
  }, []);

  console.log(allUsers);

  return (
    <div className="flex flex-col items-center gap-3">
      {allUsers?.map((user, index) => (
        <UserProfileTag
          dbUser={user}
          setSelectedUserIndex={setSelectedUserIndex}
          selectedUserIndex={selectedUserIndex}
          index={index}
          friendRequests={friendRequests}
          handleSendFriendRequest={handleSendFriendRequest}
        />
      ))}
    </div>
  );
};

export default AllUsers;
