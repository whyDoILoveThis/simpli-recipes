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
import MyDropdownTrigger from "./ui/MyDropdownTrigger";
import DateAndTime from "./ui/DateAndTime";
import RequestCard from "./ui/RequestCard";

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
            <RequestCard
              index={index}
              uid={request.requesterId}
              handleAccept={handleAccept}
              handleReject={handleReject}
              handleDelete={handleDelete}
              request={request}
              user={user}
            />
          );
        })
      ) : (
        <p>No friend requests found.</p>
      )}
    </div>
  );
};

export default FriendRequests;
