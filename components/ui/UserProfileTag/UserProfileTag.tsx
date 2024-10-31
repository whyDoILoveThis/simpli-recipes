"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../button";
import AddUserButton from "@/components/icons/AddUserButton";
import ProfileButton from "@/components/icons/ProfileButton";
import { fbGetUserById } from "@/firebase/fbGetUserById";

interface Props {
  dbUser?: User | null;
  dbUserId?: string;
  setSelectedUserIndex?: (index: number) => void;
  selectedUserIndex?: number;
  index?: number;
  friendRequests?: FriendRequest[] | null;
  handleSendFriendRequest?: (userId: string) => void;
  nameOnly?: boolean;
  nameSize?: string;
  imageOnly?: boolean;
  imageSize?: number;
}

const UserProfileTag = ({
  dbUser,
  dbUserId,
  setSelectedUserIndex,
  selectedUserIndex,
  index,
  friendRequests,
  handleSendFriendRequest,
  nameOnly,
  nameSize,
  imageOnly,
  imageSize = 30,
}: Props) => {
  const { userId } = useAuth();
  const [theUser, setTheUser] = useState<User | null>();

  useEffect(() => {
    if (dbUserId !== null && dbUserId) {
      const getUser = async () => {
        setTheUser(await fbGetUserById(dbUserId));
      };
      getUser();
    } else {
      setTheUser(dbUser);
    }
  }, []);

  if (!theUser || theUser === null) return;

  if (nameOnly) return <p className={`text-${nameSize}`}>{theUser.fullName}</p>;

  if (imageOnly) {
    return (
      theUser.photoUrl && (
        <Image
          className="rounded-full"
          width={imageSize}
          height={imageSize}
          src={theUser.photoUrl}
          alt={theUser.photoUrl}
        />
      )
    );
  }

  return (
    <div
      onClick={() => {
        setSelectedUserIndex !== undefined &&
          index !== undefined &&
          theUser !== null &&
          theUser?.userId !== userId &&
          setSelectedUserIndex(index);
      }}
      className={`${
        selectedUserIndex !== index &&
        theUser.userId !== userId &&
        "cursor-pointer"
      } flex gap-2 items-center rounded-3xl border w-fit p-2 backdrop-blur-lg bg-black bg-opacity-40`}
      key={index}
    >
      {theUser.photoUrl && (
        <Image
          className="rounded-full"
          width={30}
          height={30}
          src={theUser.photoUrl}
          alt={theUser.photoUrl}
        />
      )}
      <p>{theUser.fullName}</p>
      {handleSendFriendRequest !== undefined &&
        selectedUserIndex === index &&
        theUser.userId !== userId && (
          <div className="flex items-center gap-2">
            {theUser.userId &&
              userId &&
              // Check if friendRequests is an array and find if there's a match
              !(
                Array.isArray(theUser.friendRequests) &&
                theUser.friendRequests.find((req) => req.requesterId === userId)
              ) &&
              !(
                Array.isArray(theUser.friends) &&
                theUser.friends.includes(userId)
              ) &&
              !(
                Array.isArray(friendRequests) &&
                theUser !== null &&
                friendRequests.find(
                  (req) => req.requesterId === theUser?.userId
                )
              ) && (
                <Button
                  onClick={() =>
                    theUser !== null &&
                    theUser?.userId &&
                    handleSendFriendRequest(theUser?.userId)
                  }
                  variant="green"
                  className="btn-round"
                >
                  <AddUserButton />
                  {theUser.friendRequests ? (
                    theUser.friendRequests?.map((req, index) => (
                      <span key={index}>{req.requesterId}</span>
                    ))
                  ) : (
                    <p>ass</p>
                  )}
                </Button>
              )}

            {theUser.userId !== userId && (
              <Link href={`/profile/${theUser.userId}`}>
                <Button className="btn-round">
                  <ProfileButton />
                </Button>
              </Link>
            )}
          </div>
        )}
    </div>
  );
};

export default UserProfileTag;
