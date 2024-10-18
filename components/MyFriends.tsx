import { useEffect, useState } from "react";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "./ui/button";
import { fbRemoveFriend } from "@/firebase/fbRemoveFriend"; // Assuming you have a function to remove a friend
import { useAuth } from "@clerk/nextjs";
import { useUserFriendsStore } from "@/hooks/useUserFriendsStore";
import { useUserStore } from "@/hooks/useUserStore";

const MyFriends = () => {
  const { userId } = useAuth(); // Get current user ID
  const { friends, loadingFriends, fetchUserFriends } = useUserFriendsStore(); // Hook to fetch user friends
  const { refetchUser } = useUserStore(); // Assuming you have a refetch function for user data
  const [localFriends, setLocalFriends] = useState(friends || []); // Local state for friends

  // Update local friends when the hook returns updated data
  useEffect(() => {
    if (friends) {
      setLocalFriends(friends);
    }
  }, [friends]);

  const handleRemoveFriend = async (friendId: string) => {
    if (!userId) return;

    try {
      await fbRemoveFriend(userId, friendId); // Function to remove the friend
      setLocalFriends((prev) =>
        prev.filter((friend) => friend.userId !== friendId)
      );
      refetchUser(); // Optionally refetch user data
      fetchUserFriends(userId);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  useEffect(() => {
    userId && fetchUserFriends(userId);
  }, []);

  if (loadingFriends) return <div>Loading friends...</div>;

  return (
    <div>
      <h2>My Friends</h2>
      {localFriends && localFriends.length > 0 ? (
        localFriends.map((friend, index) => (
          <div
            key={index}
            className="relative flex items-center gap-4 border rounded-3xl p-3 m-2"
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Button className="w-[30px] h-[30px] p-0">
                  <BsThreeDots className="text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-1">
                <DropdownMenuItem
                  onClick={() =>
                    friend.userId && handleRemoveFriend(friend.userId)
                  }
                  className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                >
                  Remove Friend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {friend.photoUrl ? (
              <img
                src={friend.photoUrl || undefined} // Handle undefined photoUrl
                alt={`${friend.fullName || "User"}'s profile`} // Handle undefined fullName
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300"></div> // Placeholder if no photo
            )}
            <div>
              <p>{friend.fullName || "Unknown User"}</p>{" "}
              {/* Handle undefined fullName */}
              {/* Add more friend details if needed */}
            </div>
          </div>
        ))
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default MyFriends;
