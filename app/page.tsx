"use client";
import Image from "next/image";
import { useUserData } from "@/hooks/useUserData";
import { useState } from "react";
import { useAllUsers } from "@/hooks/useAllUsers";
import RecipeManager from "@/components/RecipeManager";
import UserProfileCard from "@/components/ui/UserProfileCard";

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
        : dbUser && <UserProfileCard />}
      <article>
        <h2>All Users</h2>
        {allUsers?.map((user, index) => (
          <div key={index}>{user.fullName}</div>
        ))}
      </article>
      <h2>Recipe Manager</h2>
      <RecipeManager />
    </div>
  );
}
