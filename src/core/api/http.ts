import { ApiClientError } from "@/core/api/ApiClientError";
import { API_URL } from "@/core/config";

const TIMEOUT_MS = 15_000;

type Envelope = {
  data?: unknown;
  error?: { code?: string; message?: string; details?: unknown };
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

/** One plain request. No token handling here, see client.ts */
export async function request<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    throw new ApiClientError(
      0,
      aborted ? "TIMEOUT" : "NETWORK_ERROR",
      aborted
        ? "The request took too long. Please try again."
        : "Can't reach the server. Check your internet connection.",
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  let json: Envelope | null = null;
  try {
    json = text ? (JSON.parse(text) as Envelope) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      json?.error?.code ?? "HTTP_ERROR",
      json?.error?.message ?? "Something went wrong. Please try again.",
      json?.error?.details,
    );
  }

  return json?.data as T;
}
