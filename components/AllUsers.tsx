import { useAllUsersStore } from "@/hooks/useAllUsersStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import AddUserButton from "./icons/AddUserButton";
import ProfileButton from "./icons/ProfileButton";
import { fbSendFriendRequest } from "@/firebase/fbManageFriendRequest";
import { useAuth } from "@clerk/clerk-react";
import { useUserData } from "@/hooks/useUserData";
import { useSentRequests } from "@/hooks/useSentRequests";
import { useFriendRequests } from "@/hooks/useFriendRequests";

const AllUsers = () => {
  const { allUsers, fetchAllUsers } = useAllUsersStore();
  const { refetchUser } = useUserData();
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
        <div
          onClick={() => {
            user.userId !== userId && setSelectedUserIndex(index);
          }}
          className={`${
            selectedUserIndex !== index &&
            user.userId !== userId &&
            "cursor-pointer"
          } flex gap-2 items-center rounded-3xl border w-fit p-2 `}
          key={index}
        >
          {user.photoUrl && (
            <Image
              className="rounded-full"
              width={30}
              height={30}
              src={user.photoUrl}
              alt={user.photoUrl}
            />
          )}
          <p>{user.fullName}</p>
          {selectedUserIndex === index && user.userId !== userId && (
            <div className="flex items-center gap-2">
              {user.userId &&
                userId &&
                // Check if friendRequests is an array and find if there's a match
                !(
                  Array.isArray(user.friendRequests) &&
                  user.friendRequests.find((req) => req.requesterId === userId)
                ) &&
                !(
                  Array.isArray(user.friends) && user.friends.includes(userId)
                ) &&
                !(
                  Array.isArray(friendRequests) &&
                  friendRequests.find((req) => req.requesterId === user.userId)
                ) && (
                  <Button
                    onClick={() =>
                      user.userId && handleSendFriendRequest(user.userId)
                    }
                    variant="green"
                    className="w-[35px] h-[35px]"
                  >
                    <AddUserButton />
                    {user.friendRequests ? (
                      user.friendRequests?.map((req, index) => (
                        <span key={index}>{req.requesterId}</span>
                      ))
                    ) : (
                      <p>ass</p>
                    )}
                  </Button>
                )}

              {user.userId !== userId && (
                <Button className="w-[35px] h-[35px]">
                  <ProfileButton />
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
