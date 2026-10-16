import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT = 8;

type SearchState = {
  /** Newest first */
  recent: string[];
  add: (term: string) => void;
  remove: (term: string) => void;
  clear: () => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recent: [],

      add: (term) =>
        set((state) => {
          const value = term.trim();
          if (!value) return state;

          const others = state.recent.filter(
            (item) => item.toLowerCase() !== value.toLowerCase(),
          );
          return { recent: [value, ...others].slice(0, MAX_RECENT) };
        }),

      remove: (term) =>
        set((state) => ({
          recent: state.recent.filter((item) => item !== term),
        })),

      clear: () => set({ recent: [] }),
    }),
    {
      name: "novara-search",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recent: state.recent }),
    },
  ),
);
