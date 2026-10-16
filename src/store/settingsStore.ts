import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NotificationPrefs = {
  payment: boolean;
  tracking: boolean;
  completeOrder: boolean;
  general: boolean;
};

export type SecurityPrefs = {
  faceId: boolean;
  touchId: boolean;
  /** Stay signed in on this device. The password itself is never stored */
  rememberLogin: boolean;
};

type SettingsState = {
  notifications: NotificationPrefs;
  security: SecurityPrefs;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setSecurity: (key: keyof SecurityPrefs, value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: {
        payment: true,
        tracking: true,
        completeOrder: true,
        general: true,
      },
      security: {
        faceId: false,
        touchId: false,
        rememberLogin: true,
      },

      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      setSecurity: (key, value) =>
        set((state) => ({
          security: { ...state.security, [key]: value },
        })),
    }),
    {
      name: "novara-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        security: state.security,
      }),
    },
  ),
);
