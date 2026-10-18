/** Every failed API call becomes one of these, so screens handle errors the same way */
export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isNetwork() {
    return this.code === "NETWORK_ERROR" || this.code === "TIMEOUT";
  }
}

export const errorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again.",
) => (err instanceof ApiClientError ? err.message : fallback);

/** Turns the server's validation details into { fieldName: message } */
export function fieldErrorsFrom(err: unknown): Record<string, string> {
  if (!(err instanceof ApiClientError) || !Array.isArray(err.details))
    return {};

  const result: Record<string, string> = {};
  for (const item of err.details as { path?: string; message?: string }[]) {
    const field = item.path?.split(".").pop();
    if (field && item.message && !result[field]) result[field] = item.message;
  }
  return result;
}
