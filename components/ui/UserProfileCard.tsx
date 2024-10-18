"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useUserStore } from "@/hooks/useUserStore";
import Friends from "../icons/Friends";
import { Button } from "./button";
import Heart from "../icons/Heart";
import Document from "../icons/Document";
import { useUserFriendsStore } from "@/hooks/useUserFriendsStore";
import { useRecipeStore } from "@/hooks/userRecipeStore";

interface Props {
  setShowMyRecipes: (param: boolean) => void;
  setShowMyFriends: (param: boolean) => void;
}
const UserProfileCard = ({ setShowMyRecipes, setShowMyFriends }: Props) => {
  const { dbUser, loadingUser, isSavingUser } = useUserStore();
  const { friends, fetchUserFriends } = useUserFriendsStore();
  const { recipes } = useRecipeStore();

  useEffect(() => {
    dbUser?.userId && fetchUserFriends(dbUser.userId);
  }, [dbUser]);

  if (!dbUser) return;

  return (
    <div className="flex flex-col gap-3 w-fit border border-slate-700 rounded-3xl m-4 p-4">
      {/* User is found, you can display their info here */}
      <div className="flex gap-1 border rounded-full w-fit p-2 items-center">
        {dbUser.photoUrl && (
          <Image
            className="rounded-full"
            src={dbUser.photoUrl}
            alt="User Photo"
            width={25}
            height={25}
          />
        )}
        <p>{dbUser?.fullName}</p>
      </div>
      <div className="flex gap-2 w-fit">
        <Button
          onClick={() => {
            setShowMyRecipes(true);
            setShowMyFriends(false);
          }}
          className="flex gap-1 items-center"
        >
          <Document /> {recipes?.length || "0"}
        </Button>
        <Button
          onClick={() => {
            setShowMyFriends(true);
            setShowMyRecipes(false);
          }}
          className="flex gap-1 items-center"
        >
          <Friends />
          {friends?.length || "0"}
        </Button>
        <Button className="flex gap-1 items-center">
          <Heart /> {dbUser.favoriteRecipes?.length || "0"}
        </Button>
      </div>
    </div>
  );
};

export default UserProfileCard;
