"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useUserStore } from "@/hooks/useUserStore";
import Friends from "../icons/Friends";
import { Button } from "./button";
import Heart from "../icons/Heart";
import DocumentIcon from "../icons/DocumentIcon";
import { useUserFriendsStore } from "@/hooks/useUserFriendsStore";
import { useRecipeStore } from "@/hooks/userRecipeStore";
import UserProfileTag from "./UserProfileTag/UserProfileTag";

interface Props {
  setShowMyRecipes: (param: boolean) => void;
  setShowMyFriends: (param: boolean) => void;
  setShowMyFavorites: (param: boolean) => void;
}
const UserProfileCard = ({
  setShowMyRecipes,
  setShowMyFriends,
  setShowMyFavorites,
}: Props) => {
  const { dbUser, loadingUser, isSavingUser } = useUserStore();
  const { friends, fetchUserFriends } = useUserFriendsStore();
  const { recipes } = useRecipeStore();

  useEffect(() => {
    dbUser?.userId && fetchUserFriends(dbUser.userId);
  }, [dbUser]);

  if (!dbUser) return;

  return (
    <div className="flex flex-col bg-black bg-opacity-20 gap-3 w-fit max-w-[450px] border border-slate-700 rounded-3xl m-4 p-4">
      {/* User is found, you can display their info here */}
      <UserProfileTag dbUser={dbUser} />
      <div className="flex gap-2 w-fit">
        <Button
          onClick={() => {
            setShowMyRecipes(true);
            setShowMyFriends(false);
            setShowMyFavorites(false);
          }}
          className="border-orange-500 border-opacity-30"
        >
          <span className="text-orange-300 flex gap-1 items-center">
            <DocumentIcon /> {recipes?.length || "0"}
          </span>
        </Button>
        <Button
          onClick={() => {
            setShowMyFriends(true);
            setShowMyRecipes(false);
            setShowMyFavorites(false);
          }}
          className="border-blue-500 border-opacity-40"
        >
          <span className="text-blue-300 flex gap-1 items-center">
            <Friends />
            {friends?.length || "0"}
          </span>
        </Button>
        <Button
          onClick={() => {
            setShowMyFriends(false);
            setShowMyRecipes(false);
            setShowMyFavorites(true);
          }}
          className="border-pink-500 border-opacity-30"
        >
          <span className="text-pink-300 flex gap-1 items-center">
            <Heart />
            {dbUser.favoriteRecipes?.length || "0"}
          </span>
        </Button>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non delectus
        perspiciatis possimus id nemo nam natus recusandae at quo, corporis
        minima doloremque quis, voluptates sequi quos similique quia ipsam illo!
      </p>
    </div>
  );
};

export default UserProfileCard;
