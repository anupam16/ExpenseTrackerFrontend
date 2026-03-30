import { z } from "zod";
import { authStorage } from "./storage";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

const refreshTokenResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
  }),
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        json && typeof json.message === "string"
          ? json.message
          : "Session expired. Please login again.";
      throw new Error(message);
    }

    const parsed = refreshTokenResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error("Unexpected refresh token response from server.");
    }

    return parsed.data.data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function getHeadersWithDefaults(
  headersInit: HeadersInit,
  body?: BodyInit | null,
) {
  const headers = new Headers(headersInit);

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function fetchWithAutoRefresh(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const initialHeaders = getHeadersWithDefaults(init.headers ?? {}, init.body);
  const existingToken = authStorage.getAccessToken();

  if (existingToken && !initialHeaders.has("Authorization")) {
    initialHeaders.set("Authorization", `Bearer ${existingToken}`);
  }

  let response = await fetch(url, {
    ...init,
    headers: initialHeaders,
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    const newAccessToken = await refreshAccessToken();
    authStorage.setAccessToken(newAccessToken);

    const retryHeaders = getHeadersWithDefaults(init.headers ?? {}, init.body);
    retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

    response = await fetch(url, {
      ...init,
      headers: retryHeaders,
    });

    return response;
  } catch {
    authStorage.clearSession();
    return response;
  }
}
