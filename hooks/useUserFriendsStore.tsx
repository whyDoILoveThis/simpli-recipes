import { create } from "zustand";
import { fbGetUserById } from "@/firebase/fbGetUserById";

// Zustand store for managing user friends globally
interface UserFriendsStore {
  friends: User[] | null;
  loadingFriends: boolean;
  fetchUserFriends: (userId: string) => Promise<void>;
}

export const useUserFriendsStore = create<UserFriendsStore>((set) => ({
  friends: null,
  loadingFriends: true,

  // Async function to fetch user's friends and update the global state
  fetchUserFriends: async (userId: string) => {
    if (!userId) {
      set({ loadingFriends: false });
      return;
    }

    try {
      set({ loadingFriends: true });

      const fetchedUser = await fbGetUserById(userId);
      const friendUids = fetchedUser?.friends || [];

      const friendFetches = friendUids.map(async (friendUid) => {
        const friendUser = await fbGetUserById(friendUid);
        return friendUser;
      });

      const friendsList = (await Promise.all(friendFetches)) as User[];

      set({ friends: friendsList });
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      set({ loadingFriends: false });
    }
  },
}));
