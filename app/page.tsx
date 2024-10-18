"use client";
import Image from "next/image";
import { useUserData } from "@/hooks/useUserData";
import { useState } from "react";
import RecipeManager from "@/components/RecipeManager";
import UserProfileCard from "@/components/ui/UserProfileCard";
import Community from "@/components/Community";

export default function Home() {
  const { dbUser, loadingUser, isSavingUser } = useUserData();
  const [showMyRecipes, setShowMyRecipes] = useState(true);
  const [showMyFriends, setShowMyFriends] = useState(false);

  // 🖼️ UI Feedback for Loading or No User Found
  return (
    <div>
      {loadingUser
        ? "Loading user data..." // Loading spinner or text
        : !dbUser && isSavingUser
        ? "Saving user data to database" // No user found after loading completes
        : dbUser && (
            <UserProfileCard
              setShowMyRecipes={setShowMyRecipes}
              setShowMyFriends={setShowMyFriends}
            />
          )}

      {!loadingUser && dbUser && !showMyFriends && showMyRecipes && (
        <RecipeManager />
      )}
      {!loadingUser && dbUser && !showMyRecipes && showMyFriends && (
        <Community />
      )}
    </div>
  );
}
