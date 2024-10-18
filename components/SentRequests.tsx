import { fbGetUserById } from "@/firebase/fbGetUserById";
import {
  fbAcceptFriendRequest,
  fbDeleteSentRequest,
  fbRejectFriendRequest,
  fbRemoveFriendRequest,
} from "@/firebase/fbManageFriendRequest";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useSentRequests } from "@/hooks/useSentRequests";
import { useUserStore } from "@/hooks/useUserStore";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BsThreeDots } from "react-icons/bs";
import RequestStatus from "./ui/RequestStatus";

const SentRequests = () => {
  const { sentFriendRequests, loadingRequests, refetchFriendRequests } =
    useFriendRequests();
  const { userId } = useAuth();
  const { refetchUser } = useUserStore();
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [localRequests, setLocalRequests] = useState(sentFriendRequests || []); // Track requests locally
  // Fetch users for all the friend requests
  useEffect(() => {
    const fetchUsers = async () => {
      if (!sentFriendRequests || sentFriendRequests.length === 0) {
        setLoadingUsers(false);
        return;
      }

      try {
        const userFetches = sentFriendRequests.map(async (request) => {
          const user = await fbGetUserById(request.userUid); // Fetch user by ID
          return { userUid: request.userUid, user };
        });

        const userResults = await Promise.all(userFetches); // Wait for all fetches to complete
        const usersMap: { [key: string]: User | null } = {};

        userResults.forEach((result) => {
          usersMap[result.userUid] = result.user; // Store user even if it's null
        });

        setUsers(usersMap); // Store users by their requesterId
        sentFriendRequests && setLocalRequests(sentFriendRequests); // Initialize local requests
      } catch (error) {
        console.error("Error fetching users for requests:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers(); // Fetch users on component mount
  }, [sentFriendRequests]);

  const handleAccept = async (requesterId: string) => {
    if (!userId) return;

    try {
      await fbAcceptFriendRequest(userId, requesterId);
      // Update local state after accepting the request
      setLocalRequests((prev) =>
        prev.filter((request) => request.userUid !== requesterId)
      );
      // Optional: You can also trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleStop = async (requesterId: string, status: string) => {
    if (!userId) return;

    try {
      await fbDeleteSentRequest(requesterId, userId, status);
      // Update local state after rejecting the request
      await refetchFriendRequests();
      sentFriendRequests && setLocalRequests(sentFriendRequests);
      // Optional: Trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleDelete = async (requesterId: string, status: string) => {
    if (!userId) return;

    try {
      await fbDeleteSentRequest(requesterId, userId, status);
      // Update local state after rejecting the request
      await refetchFriendRequests();
      sentFriendRequests && setLocalRequests(sentFriendRequests);
      // Optional: Trigger a refetch if needed
      // refetchRequests();
      refetchUser();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  if (loadingRequests || loadingUsers)
    return <div>Loading friend requests...</div>;

  if (sentFriendRequests && sentFriendRequests !== localRequests) {
    setLocalRequests(sentFriendRequests);
  }
  return (
    <div>
      {" "}
      {localRequests && localRequests.length > 0 ? (
        localRequests.map((request, index) => {
          const user = users[request.userUid];
          return (
            <div
              key={index}
              className=" relative flex flex-col items-center gap-2 border rounded-3xl p-3 m-2"
            >
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Button className="w-[30px] h-[30px] p-0">
                      <BsThreeDots className="text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-1">
                    {request.status === "pending" ? (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStop(request.userUid, request.status)
                        }
                        className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                      >
                        Stop Request
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() =>
                          handleDelete(request.userUid, request.status)
                        }
                        className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                      >
                        DELETE
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {user?.photoUrl && (
                  <img
                    src={user.photoUrl || undefined} // Handle undefined photoUrl
                    alt={`${user.fullName || "User"}'s profile`} // Handle undefined fullName
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p>{user?.fullName || "Unknown User"}</p>{" "}
                  {/* Handle undefined fullName */}
                  <RequestStatus status={request.status} />
                </div>
              </div>
              <p className="text-sm text-slate-400">
                {request.sentAt.toDate().toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          );
        })
      ) : (
        <p>No sent requests found.</p>
      )}
    </div>
  );
};

export default SentRequests;
