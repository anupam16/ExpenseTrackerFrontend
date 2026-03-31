import { z } from "zod";
import { API_BASE_URL, fetchWithAutoRefresh } from "./authenticatedFetch";
import type {
  AuthMeResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RegisterPayload,
  RegisterResponse,
} from "./types";

const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
  }),
});

const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
  }),
});

const meResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
  }),
});

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Login failed. Please try again.";
    throw new Error(message);
  }

  const parsed = loginResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected response from server.");
  }

  return parsed.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await fetchWithAutoRefresh(
    `${API_BASE_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    },
  );

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Logout failed. Please try again.";
    throw new Error(message);
  }

  const parsed = logoutResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected response from server.");
  }

  return parsed.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Registration failed. Please try again.";
    throw new Error(message);
  }

  const parsed = registerResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected response from server.");
  }

  return parsed.data;
}

export async function getMyProfile(): Promise<AuthMeResponse> {
  const response = await fetchWithAutoRefresh(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json && typeof json.message === "string"
        ? json.message
        : "Failed to load profile.";
    throw new Error(message);
  }

  const parsed = meResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected profile response from server.");
  }

  return parsed.data;
}
