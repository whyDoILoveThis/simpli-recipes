import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Search from "./icons/Search";
import AllUsers from "./AllUsers";
import MyRequests from "./MyRequests";
import MyFriends from "./MyFriends";

const Community = () => {
  return (
    <div>
      {" "}
      <h2 className="text-center font-bold mb-6 mt-8">Community</h2>
      <Tabs
        defaultValue="all-users"
        className="flex w-full flex-col items-center"
      >
        <TabsList className="rounded-full">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger className="flex gap-1 items-center" value="friends">
            Friends
          </TabsTrigger>
          <TabsTrigger className="flex gap-1 items-center" value="requests">
            Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-users">
          <AllUsers />
        </TabsContent>

        <TabsContent value="friends">
          <MyFriends />
        </TabsContent>
        <TabsContent value="requests">
          <MyRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
