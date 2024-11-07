import { fbSendFriendRequest } from "@/firebase/fbManageFriendRequest";
import { useAllUsersStore } from "@/hooks/useAllUsersStore";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "./button";
import AddUserIcon from "../icons/AddUserIcon";

interface Props {
  theUser: User;
}
const AddUserButton = ({ theUser }: Props) => {
  const { userId } = useAuth();
  const { allUsers, fetchAllUsers } = useAllUsersStore();
  const { refetchUser } = useUserStore();
  const [sentRequests, setSentRequests] = useState<string[]>([]); // State to track sent requests

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

  return (
    <Button
      onClick={() =>
        theUser !== null &&
        theUser?.userId &&
        handleSendFriendRequest(theUser?.userId)
      }
      variant="green"
      className="btn-round"
    >
      <AddUserIcon />
      {theUser.friendRequests ? (
        theUser.friendRequests?.map((req, index) => (
          <span key={index}>{req.requesterId}</span>
        ))
      ) : (
        <p>ass</p>
      )}
    </Button>
  );
};

export default AddUserButton;
