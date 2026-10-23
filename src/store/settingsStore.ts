import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SecurityPrefs = {
  faceId: boolean;
  touchId: boolean;
  /** Stay signed in on this device. The password itself is never stored */
  rememberLogin: boolean;
};

type SettingsState = {
  security: SecurityPrefs;
  setSecurity: (key: keyof SecurityPrefs, value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      security: {
        faceId: false,
        touchId: false,
        rememberLogin: true,
      },

      setSecurity: (key, value) =>
        set((state) => ({
          security: { ...state.security, [key]: value },
        })),
    }),
    {
      name: "novara-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ security: state.security }),
    },
  ),
);
