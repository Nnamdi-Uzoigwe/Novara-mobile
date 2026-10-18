import {
  clearTokens,
  configureTokens,
  getRefreshToken,
  refreshTokens,
  saveTokens,
} from "@/core/api/tokens";
import type { ApiUser, AuthResponse } from "@/core/api/types";
import { authApi } from "@/features/auth/api";
import { useOnboardingStore } from "@/store/onboardingStore";
import { clearAccountData } from "@/store/session";
import { useSettingsStore } from "@/store/settingsStore";
import { useUserStore, type User } from "@/store/userStore";
import { create } from "zustand";

export const toStoreUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatarUri: user.avatarUrl ?? undefined,
  provider: user.provider,
});

type Hydratable = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

/** Saved stores load asynchronously, so wait for them before deciding anything at launch */
const hydrated = (store: Hydratable) =>
  store.persist.hasHydrated()
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const unsubscribe = store.persist.onFinishHydration(() => {
          unsubscribe();
          resolve();
        });
      });

type Status = "loading" | "signedOut" | "signedIn";

type AuthState = {
  status: Status;
  /** Run once when the app starts. Decides between signed in and signed out */
  bootstrap: () => Promise<void>;
  /** Call after login or email verification, with the server's response */
  completeSignIn: (data: AuthResponse) => Promise<void>;
  /** Ends this device's session on the server, then wipes local account data */
  signOut: () => Promise<void>;
  /** Local cleanup only, for when the server already ended the session (account deleted) */
  endSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "loading",

  bootstrap: async () => {
    await Promise.all([
      hydrated(useUserStore),
      hydrated(useSettingsStore),
      hydrated(useOnboardingStore),
    ]);

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      set({ status: "signedOut" });
      return;
    }

    // "Remember Password" is off: ask for a fresh sign-in each time the app starts
    if (!useSettingsStore.getState().security.rememberLogin) {
      await get().signOut();
      return;
    }

    try {
      const ok = await refreshTokens();
      set({ status: ok ? "signedIn" : "signedOut" });
    } catch {
      // No connection at launch: stay signed in with the saved profile and refresh later
      set({ status: useUserStore.getState().user ? "signedIn" : "signedOut" });
    }
  },

  completeSignIn: async (data) => {
    await saveTokens(data.tokens);
    useUserStore.getState().setUser(toStoreUser(data.user));
    useOnboardingStore.getState().markSeen();
    set({ status: "signedIn" });
  },

  signOut: async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Offline is fine: the local session is removed either way
      }
    }
    await clearTokens();
    clearAccountData();
    set({ status: "signedOut" });
  },

  endSession: async () => {
    await clearTokens();
    clearAccountData();
    set({ status: "signedOut" });
  },
}));

// Keep the saved profile in step with the server, and sign out if the session is rejected
configureTokens({
  onRefreshed: (user) => useUserStore.getState().setUser(toStoreUser(user)),
  onExpired: () => {
    clearAccountData();
    useAuthStore.setState({ status: "signedOut" });
  },
});
