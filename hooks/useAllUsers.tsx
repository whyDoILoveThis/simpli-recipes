import { useEffect, useState } from "react";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { fbSaveUser } from "@/firebase/fbSaveUser";
import { useAuth, useUser } from "@clerk/nextjs";
import { fbGetAllUsers } from "@/firebase/fbGetAllUsers";

// Define the hook to handle user fetching and saving
export const useAllUsers = () => {
  const [allUsers, setAllUsers] = useState<User[] | null>(null);

  // Function for fetching and saving user data
  useEffect(() => {
    const getAllUsers = async () => {
      setAllUsers(await fbGetAllUsers());
    };

    getAllUsers(); // Call the function inside useEffect
  }, []);

  return { allUsers }; // Return relevant states
};
