import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import MyDropdownTrigger from "./MyDropdownTrigger";
import { Timestamp } from "firebase/firestore";
import RequestStatus from "./RequestStatus";
import DateAndTime from "./DateAndTime";

interface Props {
  index: number;
  uid: string;
  request: SentFriendRequest | FriendRequest;
  handleStop?: (uid: string, status: string) => void;
  handleDelete?: (uid: string, status: string) => void;
  handleAccept?: (uid: string) => void;
  handleReject?: (uid: string) => void;

  user: User | null;
}

const RequestCard = ({
  index,
  uid,
  request,
  handleStop,
  handleDelete,
  handleAccept,
  handleReject,
  user,
}: Props) => {
  return (
    <div
      key={index}
      className=" relative flex flex-col items-center gap-2 border rounded-3xl p-3 m-2"
    >
      <div className="flex w-full gap-3">
        <DropdownMenu>
          <MyDropdownTrigger />
          <DropdownMenuContent className="flex flex-col gap-1">
            {request.status === "pending" ? (
              <div>
                {handleStop && (
                  <DropdownMenuItem
                    onClick={() => handleStop(uid, request.status)}
                    className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                  >
                    Stop Request
                  </DropdownMenuItem>
                )}
                {handleAccept && handleReject && (
                  <div className="flex flex-col gap-1">
                    <DropdownMenuItem
                      onClick={() => handleAccept(uid)}
                      className="bg-green-600 bg-opacity-30 border border-green-500 border-opacity-60 text-green-200 dark:hover:bg-green-900"
                    >
                      Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleReject(uid)}
                      className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
                    >
                      Reject
                    </DropdownMenuItem>
                  </div>
                )}
              </div>
            ) : (
              <DropdownMenuItem
                onClick={() =>
                  handleDelete && handleDelete(uid, request.status)
                }
                className="bg-red-600 bg-opacity-30 border border-red-500 border-opacity-60 text-red-200 dark:hover:bg-red-900"
              >
                DELETE
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-1">
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
      </div>
      <DateAndTime timestamp={request.sentAt} />
    </div>
  );
};

export default RequestCard;
