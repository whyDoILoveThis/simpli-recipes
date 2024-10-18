// store/userStore.ts
import { create } from "zustand";
import { fbGetUserById } from "@/firebase/fbGetUserById";
import { fbSaveUser } from "@/firebase/fbSaveUser";

// Define the interface for the Zustand store state
interface UserState {
  dbUser: User | null;
  loadingUser: boolean;
  isSavingUser: boolean;
  fetchUser: (userId: string, user: any) => Promise<void>;
  refetchUser: () => Promise<void>;
}

// Create Zustand store
export const useUserStore = create<UserState>((set, get) => ({
  dbUser: null,
  loadingUser: true,
  isSavingUser: false,

  // Fetch user data function (requires userId and user object)
  fetchUser: async (userId: string, user: any) => {
    if (!userId) {
      set({ loadingUser: false });
      return;
    }

    try {
      set({ loadingUser: true });
      const fetchedUser = await fbGetUserById(userId);

      if (fetchedUser) {
        set({ dbUser: fetchedUser });
      } else {
        set({ isSavingUser: true });

        await fbSaveUser({
          userId,
          fullName: user?.fullName || null,
          email: user?.emailAddresses[0]?.emailAddress || null,
          photoUrl: user?.imageUrl || null,
        });

        const newUser = await fbGetUserById(userId);
        set({ dbUser: newUser, isSavingUser: false });
      }
    } catch (error) {
      console.error("Error fetching or saving user:", error);
    } finally {
      set({ loadingUser: false });
    }
  },

  // Refetch user (this will reuse the current userId and user from the state)
  refetchUser: async () => {
    const { dbUser } = get();
    if (dbUser?.userId) {
      await get().fetchUser(dbUser.userId, dbUser);
    }
  },
}));
