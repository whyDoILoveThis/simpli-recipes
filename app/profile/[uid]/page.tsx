"use client";
import RecipeCardListWithSearchFiltering from "@/components/Feed/RecipeCardListWithSearchFiltering";
import DocumentIcon from "@/components/icons/DocumentIcon";
import Friends from "@/components/icons/Friends";
import Heart from "@/components/icons/Heart";
import { Button } from "@/components/ui/button";
import UserProfileCard from "@/components/ui/UserProfileCard";
import UserProfileTag from "@/components/ui/UserProfileTag/UserProfileTag";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { fbGetUsersRecipes } from "@/firebase/fbGetUsersRecipes";
import { useUserFriendsStore } from "@/hooks/useUserFriendsStore";
import React, { useEffect, useState } from "react";

const Page = ({ params: { uid } }: { params: { uid: string } }) => {
  const [theUser, setTheUser] = useState<User | null>();
  const { friends, fetchUserFriends } = useUserFriendsStore();
  const [recipes, setRecipes] = useState<string[]>();

  useEffect(() => {
    const getUser = async () => {
      setTheUser(await fbGetUserById(uid));
      fetchUserFriends(uid);
    };
    getUser();
  }, []);
  useEffect(() => {
    const getRecipes = async () => {
      setRecipes(theUser?.recipes);
    };
    getRecipes();
  }, [theUser]);

  return (
    <div>
      <div className="flex flex-col gap-3 w-fit border border-slate-700 rounded-3xl m-4 p-4">
        {/* User is found, you can display their info here */}
        {theUser && theUser.userId && <UserProfileTag dbUser={theUser} />}{" "}
        <div className="flex gap-2 w-fit">
          <Button onClick={() => {}} className="flex gap-1 items-center">
            <DocumentIcon /> {recipes?.length || "0"}
          </Button>
          <Button onClick={() => {}} className="flex gap-1 items-center">
            <Friends />
            {friends?.length || "0"}
          </Button>
          <Button className="flex gap-1 items-center">
            <Heart /> {theUser?.favoriteRecipes?.length || "0"}
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        {theUser?.userId && (
          <RecipeCardListWithSearchFiltering
            filterUser={true}
            theUserUid={theUser.userId}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
