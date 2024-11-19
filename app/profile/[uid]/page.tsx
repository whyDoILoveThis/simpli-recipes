"use client";
import RecipeCardListWithSearchFiltering from "@/components/Feed/RecipeCardListWithSearchFiltering";
import DocumentIcon from "@/components/icons/DocumentIcon";
import Friends from "@/components/icons/Friends";
import Heart from "@/components/icons/Heart";
import MyFriends from "@/components/MyFriends";
import ProfilePageSkeleton from "@/components/ProfilePageSkeleton";
import AddUserButton from "@/components/ui/AddUserButton";
import { Button } from "@/components/ui/button";
import DateAndTime from "@/components/ui/DateAndTime";
import ItsTooltip from "@/components/ui/its-tooltip";
import RecipeCardBubble from "@/components/ui/RecipeCardBubble";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileCard from "@/components/ui/UserProfileCard";
import UserProfileTag from "@/components/ui/UserProfileTag/UserProfileTag";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { fbGetUsersRecipes } from "@/firebase/fbGetUsersRecipes";
import { fbSendFriendRequest } from "@/firebase/fbManageFriendRequest";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useUserFriendsStore } from "@/hooks/useUserFriendsStore";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const Page = ({ params: { uid } }: { params: { uid: string } }) => {
  const { userId } = useAuth();
  const [theUser, setTheUser] = useState<User | null>();
  const { friends, fetchUserFriends } = useUserFriendsStore();
  const [recipes, setRecipes] = useState<string[]>();
  const [loading, setLoading] = useState(true);
  const { friendRequests, refetchFriendRequests } = useFriendRequests();
  const { refetchUser } = useUserStore();

  useEffect(() => {
    const getUser = async () => {
      setTheUser(await fbGetUserById(uid));
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSendFriendRequest = async (recipientId: string) => {
    try {
      if (userId && recipientId) {
        await fbSendFriendRequest(userId, recipientId);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    refetchUser();
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="pt-4 px-2 pb-20">
      {/* User is found, you can display their info here */}
      <div className="w-full flex justify-center mt-2">
        {theUser && theUser.userId && (
          <div className="flex flex-col w-full gap-2 justify-center items-center">
            <div className="shadow-blue-lite rounded-full">
              <UserProfileTag
                dbUser={theUser}
                imageOnly={true}
                imageSize={120}
              />
            </div>
            <div className="flex gap-2 relative items-center">
              <UserProfileTag
                dbUser={theUser}
                nameOnly={true}
                nameSize={"3xl"}
                nameOnlyClassNames={["font-bold"]}
              />
              <div className="addfriendbutton absolute -right-10">
                <ItsTooltip
                  tooltipClassName="text-nowrap -translate-x-7"
                  tooltipText="Add Friend"
                  delay={800}
                >
                  <AddUserButton theUser={theUser} />
                </ItsTooltip>
              </div>
            </div>
            <span className="flex gap-1 text-[11px] text-slate-400">
              <p>Joined:</p>
              <DateAndTime timestamp={theUser.createdAt} />
            </span>
            <div className="flex gap-3 font-bold items-center justify-evenly my-2 mt-4 w-full max-w-[600px]">
              <span className="flex flex-col items-center justify-center text-pink-300">
                <p className="text-3xl">485</p>
                <p>Total Hearts</p>
              </span>
              <div className="text-4xl text-blue-200">|</div>
              <span className="flex flex-col items-center justify-center text-blue-300">
                <p className="text-3xl">987</p>
                <p>Friends</p>
              </span>
              <div className="text-4xl text-blue-200">|</div>
              <span className="flex flex-col items-center justify-center text-orange-300">
                <p className="text-3xl">67</p>
                <p>Creations</p>
              </span>
            </div>
            <p className="text-[11px] max-w-[500px] mx-8 mb-4 text-blue-200 text-opacity-90">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Doloremque sequi minus illum et fugiat perspiciatis explicabo
              accusantium at minima omnis ad pariatur eligendi veniam, dolore
              excepturi, non aut cum iusto natus alias! Quae, temporibus.
              Tenetur, deleniti nam voluptatum tempore, cumque rem quasi vitae
              optio quibusdam pariatur numquam quaerat iste a.
            </p>
          </div>
        )}{" "}
      </div>
      <Tabs
        defaultValue="all-users"
        className="flex w-full flex-col items-center"
      >
        <TabsList className="rounded-full">
          <TabsTrigger value="all-users">
            {theUser?.fullName?.split(" ")[0]}'s Recipes
          </TabsTrigger>
          <TabsTrigger className="flex gap-1 items-center" value="friends">
            Friends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-users">
          <div className="flex justify-center">
            {theUser?.userId && (
              <RecipeCardListWithSearchFiltering
                filterUser={true}
                theUserUid={theUser.userId}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="friends">
          {" "}
          <MyFriends userUid={theUser?.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
