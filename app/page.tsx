"use client";
import Image from "next/image";
import { useUserData } from "@/hooks/useUserData";
import { useState } from "react";
import { useAllUsers } from "@/hooks/useAllUsers";

export default function Home() {
  const { allUsers } = useAllUsers();
  const { dbUser, loadingUser, isSavingUser } = useUserData();

  // 🖼️ UI Feedback for Loading or No User Found
  return (
    <div>
      {loadingUser
        ? "Loading user data..." // Loading spinner or text
        : !dbUser && isSavingUser
        ? "Saving user data to database" // No user found after loading completes
        : dbUser && (
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
            </div>
          )}
      <article>
        <h2>All Users</h2>
        {allUsers?.map((user, index) => (
          <div key={index}>{user.fullName}</div>
        ))}
      </article>
    </div>
  );
}
