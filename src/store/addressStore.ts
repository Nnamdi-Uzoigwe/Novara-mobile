import type { Address } from "@/features/checkout/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AddressState = {
  selected: Address | null;
  setSelected: (address: Address) => void;
  clear: () => void;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      selected: null,
      setSelected: (address) => set({ selected: address }),
      clear: () => set({ selected: null }),
    }),
    {
      name: "novara-address",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selected: state.selected }),
    },
  ),
);
