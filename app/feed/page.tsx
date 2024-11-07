"use client";
import RecipeCardListWithSearchFiltering from "@/components/Feed/RecipeCardListWithSearchFiltering";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import "@/styles/loader.css";

const Page = () => {
  return (
    <div className="mt-4">
      <h2 className="font-bold text-center mb-4">Feed</h2>
      <Tabs
        defaultValue="all-posts"
        className="flex w-full flex-col items-center"
      >
        <TabsList className="rounded-full">
          <TabsTrigger value="all-posts">All Posts</TabsTrigger>
          <TabsTrigger className="flex gap-1 items-center" value="friends">
            Friends
          </TabsTrigger>
          <TabsTrigger className="flex gap-1 items-center" value="for-you">
            For You
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-posts">
          <RecipeCardListWithSearchFiltering />
        </TabsContent>

        <TabsContent value="friends">
          <RecipeCardListWithSearchFiltering filterFriends={true} />{" "}
        </TabsContent>
        <TabsContent value="for-you">sdgsdgsdfgsdfgs </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
