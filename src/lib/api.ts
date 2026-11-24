const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ErrorPayload = {
  message?: string;
  details?: unknown;
};

/**
 * Better Auth keeps the session in an httpOnly cookie, so the JWT has to be
 * minted by the auth server before the Express API can be called.
 */
export async function getApiToken() {
  const response = await fetch("/api/auth/token", { cache: "no-store" });

  if (!response.ok) {
    throw new ApiError(401, "Your session expired. Please sign in again.");
  }

  const payload = (await response.json()) as { token?: string };

  if (!payload.token) {
    throw new ApiError(401, "Your session expired. Please sign in again.");
  }

  return payload.token;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getApiToken();
  const isFormData = init.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | (ErrorPayload & T)
    | null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message ?? "Something went wrong. Please try again.",
      payload?.details,
    );
  }

  return payload as T;
}
