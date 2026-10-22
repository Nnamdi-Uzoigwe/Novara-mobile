import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AddressState = {
  /** Which saved address is used for delivery. The addresses themselves live on the server */
  selectedId: string | null;
  select: (id: string | null) => void;
  clear: () => void;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      selectedId: null,
      select: (id) => set({ selectedId: id }),
      clear: () => set({ selectedId: null }),
    }),
    {
      name: "novara-address",
      version: 1,
      // The old version saved a whole mock address, which is no longer used
      migrate: () => ({ selectedId: null }),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedId: state.selectedId }),
    },
  ),
);
