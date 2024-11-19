import { fbSendFriendRequest } from "@/firebase/fbManageFriendRequest";
import { useAllUsersStore } from "@/hooks/useAllUsersStore";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "./button";
import AddUserIcon from "../icons/AddUserIcon";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import DeleteUserIcon from "../icons/DeleteUserIcon";

interface Props {
  theUser: User;
}
const AddUserButton = ({ theUser }: Props) => {
  const { userId } = useAuth();
  const { allUsers, fetchAllUsers } = useAllUsersStore();
  const { refetchUser } = useUserStore();
  const [sentRequests, setSentRequests] = useState<string[]>([]); // State to track sent requests
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

  const checkTheUserStuffToSeeWhichButtonIconToShow = () =>
    theUser.userId &&
    userId &&
    theUser.userId !== userId &&
    // Check if friendRequests is an array and find if there's a match
    !(
      Array.isArray(theUser.friendRequests) &&
      theUser.friendRequests.find((req) => req.requesterId === userId)
    ) &&
    !(Array.isArray(theUser.friends) && theUser.friends.includes(userId)) &&
    !(
      Array.isArray(friendRequests) &&
      theUser !== null &&
      friendRequests.find((req) => req.requesterId === theUser?.userId)
    );

  const amITheUser = () =>
    theUser && theUser.userId && userId && theUser.userId === userId;

  return (
    <div>
      {!amITheUser() && (
        <Button
          onClick={() =>
            theUser !== null &&
            theUser?.userId &&
            handleSendFriendRequest(theUser?.userId)
          }
          variant={
            checkTheUserStuffToSeeWhichButtonIconToShow()
              ? "green"
              : "destructive"
          }
          className="btn-round"
        >
          {checkTheUserStuffToSeeWhichButtonIconToShow() ? (
            <AddUserIcon />
          ) : (
            <DeleteUserIcon />
          )}
        </Button>
      )}
    </div>
  );
};

export default AddUserButton;
