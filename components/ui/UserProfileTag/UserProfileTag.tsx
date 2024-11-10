"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../button";
import ProfileButton from "@/components/icons/ProfileButton";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import AddUserButton from "../AddUserButton";

interface Props {
  dbUser?: User | null;
  dbUserId?: string;
  nameOnly?: boolean;
  nameOnlyClassNames?: string[];
  nameSize?: string;
  imageOnly?: boolean;
  imageSize?: number;
}

const UserProfileTag = ({
  dbUser,
  dbUserId,
  nameOnly,
  nameOnlyClassNames,
  nameSize,
  imageOnly,
  imageSize = 30,
}: Props) => {
  const { userId } = useAuth();
  const [theUser, setTheUser] = useState<User | null>();
  const { friendRequests, refetchFriendRequests } = useFriendRequests();
  const [isOpen, setIsOpen] = useState(false);

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

  if (nameOnly)
    return (
      <p
        className={`text-${nameSize} ${
          nameOnlyClassNames && nameOnlyClassNames
        }`}
      >
        {theUser.fullName}
      </p>
    );

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
        setIsOpen(!isOpen);
      }}
      className={`${
        !isOpen && "cursor-pointer"
      } flex gap-2 items-center rounded-3xl border w-fit p-2 backdrop-blur-lg bg-black bg-opacity-40`}
      key={theUser.userId}
    >
      {theUser.photoUrl && (
        <Image
          className="rounded-full selection:bg-none select-none"
          width={30}
          height={30}
          src={theUser.photoUrl}
          alt={theUser.photoUrl}
        />
      )}
      <p className="selection:bg-none selection:select-none select-none">
        {theUser.fullName}
      </p>
      {isOpen && (
        <div className="flex items-center gap-2">
          <AddUserButton theUser={theUser} />

          {isOpen && (
            <Link href={`/profile/${theUser.userId}`}>
              <Button className="btn-round translate-x-">
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
