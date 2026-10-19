import { ApiClientError } from "@/core/api/ApiClientError";
import { request } from "@/core/api/http";
import { getAccessToken, refreshTokens } from "@/core/api/tokens";

type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Set to false for sign-in style calls that need no token. Defaults to true */
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, auth = true }: Options = {},
): Promise<T> {
  if (!auth) return request<T>(path, { method, body });

  // Right after the app starts there is no access token yet, so get one first
  if (!getAccessToken()) {
    const ok = await refreshTokens();
    if (!ok)
      throw new ApiClientError(401, "UNAUTHORIZED", "Please sign in again");
  }

  try {
    return await request<T>(path, { method, body, token: getAccessToken() });
  } catch (err) {
    // The 15 minute token ran out: refresh once and repeat the request
    if (
      err instanceof ApiClientError &&
      err.status === 401 &&
      err.code === "TOKEN_EXPIRED"
    ) {
      const ok = await refreshTokens();
      if (ok)
        return request<T>(path, { method, body, token: getAccessToken() });
    }
    throw err;
  }
}
