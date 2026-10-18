import { ApiClientError } from "@/core/api/ApiClientError";
import { request } from "@/core/api/http";
import type { ApiUser, AuthResponse, Tokens } from "@/core/api/types";
import * as SecureStore from "expo-secure-store";

const REFRESH_KEY = "novara_refresh_token";

// The short-lived access token only lives in memory. The refresh token lives in secure storage.
let accessToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;

type Handlers = {
  onRefreshed?: (user: ApiUser) => void;
  onExpired?: () => void;
};
let handlers: Handlers = {};

/** Lets the auth store react to refreshes without this file importing it */
export const configureTokens = (next: Handlers) => {
  handlers = next;
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => SecureStore.getItemAsync(REFRESH_KEY);

export async function saveTokens(tokens: Tokens) {
  accessToken = tokens.accessToken;
  await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken);
}

export async function clearTokens() {
  accessToken = null;
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

async function performRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const data = await request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });

    await saveTokens(data.tokens);
    handlers.onRefreshed?.(data.user);
    return true;
  } catch (err) {
    // The server rejected the token (invalid, expired or reused), so this session is over
    if (err instanceof ApiClientError && err.status === 401) {
      await clearTokens();
      handlers.onExpired?.();
      return false;
    }
    // Network trouble: keep the session and let the caller try again later
    throw err;
  }
}

/**
 * Only one refresh runs at a time. The server rotates the refresh token on every
 * use, so two refreshes at once would make it think the token was stolen.
 */
export function refreshTokens(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}
