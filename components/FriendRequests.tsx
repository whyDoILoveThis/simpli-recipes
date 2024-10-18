import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { BsThreeDots } from "react-icons/bs";
import RequestStatus from "./ui/RequestStatus";

interface Props {
  localRequests: FriendRequest[];
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
  users: { [key: string]: User | null };
  handleDelete: (id: string, status: string) => void;
}

const FriendRequests = ({
  localRequests,
  handleAccept,
  handleReject,
  handleDelete,
  users,
}: Props) => {
  return (
    <div>
      {localRequests && localRequests.length > 0 ? (
        localRequests.map((request, index) => {
          const user = users[request.requesterId];
          return (
            <div
              key={index}
              className=" relative flex items-center gap-4 border rounded-3xl p-3 m-2"
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Button className="w-[30px] h-[30px] p-0">
                    <BsThreeDots className="text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-1">
                  {request.status === "pending" ? (
                    <div className="flex flex-col gap-1">
                      <DropdownMenuItem
                        onClick={() => handleAccept(request.requesterId)}
                        className="bg-green-600 bg-opacity-30 border border-green-500 border-opacity-60 text-green-200 dark:hover:bg-green-900"
                      >
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReject(request.requesterId)}
                        className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                      >
                        Reject
                      </DropdownMenuItem>
                    </div>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        handleDelete(request.requesterId, request.status)
                      }
                      className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                    >
                      DELETE
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {user?.photoUrl ? (
                <img
                  src={user.photoUrl || undefined} // Handle undefined photoUrl
                  alt={`${user.fullName || "User"}'s profile`} // Handle undefined fullName
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-300"></div> // Placeholder if no photo
              )}
              <div>
                <p>{user?.fullName || "Unknown User"}</p>{" "}
                {/* Handle undefined fullName */}
                <RequestStatus status={request.status} />
              </div>
            </div>
          );
        })
      ) : (
        <p>No friend requests found.</p>
      )}
    </div>
  );
};

export default FriendRequests;
