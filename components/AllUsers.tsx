import { useAllUsersStore } from "@/hooks/useAllUsersStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import AddUserButton from "./icons/AddUserIcon";
import ProfileButton from "./icons/ProfileButton";
import { fbSendFriendRequest } from "@/firebase/fbManageFriendRequest";
import { useAuth } from "@clerk/clerk-react";
import { useUserStore } from "@/hooks/useUserStore";
import { useSentRequests } from "@/hooks/useSentRequests";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import UserProfileTag from "./ui/UserProfileTag/UserProfileTag";

const AllUsers = () => {
  const { allUsers, fetchAllUsers } = useAllUsersStore();
  const [sentRequests, setSentRequests] = useState<string[]>([]); // State to track sent requests
  const { mySentRequests, loadingSentRequests, refetchSentRequests } =
    useSentRequests();
  const { refetchFriendRequests } = useFriendRequests();

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
      {allUsers?.map((user) => (
        <UserProfileTag dbUser={user} />
      ))}
    </div>
  );
};

export default AllUsers;
