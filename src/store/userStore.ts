import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  name: string;
  email: string;
  /** Local image path or URL */
  avatarUri?: string;
  provider: "email" | "google";
};

// TODO: remove once real sign-in sets the user. Until then it keeps the app usable
export const DEMO_USER: User = {
  name: "Jonathan Doe",
  email: "johnjaydoe@gmail.com",
  provider: "google",
};

export const firstName = (name?: string) => name?.trim().split(/\s+/)[0];

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "avatarUri">>) => void;
  clear: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: DEMO_USER,
      setUser: (user) => set({ user }),
      updateProfile: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state,
        ),
      clear: () => set({ user: null }),
    }),
    {
      name: "novara-user",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
