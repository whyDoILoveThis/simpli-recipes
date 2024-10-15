import React from "react";
import Image from "next/image";
import { useUserData } from "@/hooks/useUserData";

const UserProfileCard = () => {
  const { dbUser, loadingUser, isSavingUser } = useUserData();

  if (!dbUser) return;

  return (
    <div>
      {/* User is found, you can display their info here */}
      <p>Welcome, {dbUser.fullName || "User"}!</p>
      {dbUser.photoUrl && (
        <Image
          src={dbUser.photoUrl}
          alt="User Photo"
          width={100}
          height={100}
        />
      )}
      <p>Creations: {dbUser.recipes?.length || "0"}</p>
      <p>Friends: {dbUser.friends?.length || "0"}</p>
      <p>Favorites: {dbUser.favoriteRecipes?.length || "0"}</p>
    </div>
  );
};

export default UserProfileCard;
