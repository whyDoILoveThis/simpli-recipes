"use client";
import Image from "next/image";
import { useUserStore } from "@/hooks/useUserStore";
import { useEffect, useState } from "react";
import RecipeManager from "@/components/RecipeManager";
import UserProfileCard from "@/components/ui/UserProfileCard";
import Community from "@/components/Community";
import { useAuth, useUser } from "@clerk/nextjs";
import UserProfileCardSkeleton from "@/components/ui/UserProfileCardSkeleton";

export default function Home() {
  const { user } = useUser();
  const { userId } = useAuth();
  const { dbUser, loadingUser, isSavingUser, fetchUser } = useUserStore();
  const [showMyRecipes, setShowMyRecipes] = useState(true);
  const [showMyFriends, setShowMyFriends] = useState(false);

  useEffect(() => {
    userId && user && fetchUser(userId, user);
  }, [user, userId]);
  console.log(dbUser);

  // 🖼️ UI Feedback for Loading or No User Found
  return (
    <div>
      {loadingUser ? (
        <UserProfileCardSkeleton /> // Loading spinner or text
      ) : !dbUser && isSavingUser ? (
        "Saving user data to database" // No user found after loading completes
      ) : (
        dbUser && (
          <div className="flex flex-col">
            <UserProfileCard
              setShowMyRecipes={setShowMyRecipes}
              setShowMyFriends={setShowMyFriends}
            />
          </div>
        )
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
