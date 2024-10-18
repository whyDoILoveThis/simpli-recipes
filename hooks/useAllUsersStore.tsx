import { create } from "zustand";
import { fbGetAllUsers } from "@/firebase/fbGetAllUsers";

// Zustand store for managing all users globally
interface AllUsersStore {
  allUsers: User[] | null;
  loadingUsers: boolean;
  fetchAllUsers: () => Promise<void>;
}

export const useAllUsersStore = create<AllUsersStore>((set) => ({
  allUsers: null,
  loadingUsers: true,

  // Function for fetching all users and storing them in global state
  fetchAllUsers: async () => {
    try {
      set({ loadingUsers: true });
      const users = await fbGetAllUsers();
      console.log("users", users);

      set({ allUsers: users });
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      set({ loadingUsers: false });
    }
  },
}));
