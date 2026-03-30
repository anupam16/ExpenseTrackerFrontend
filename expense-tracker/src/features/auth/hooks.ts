import { useMutation } from "@tanstack/react-query";
import { login, logout, register } from "./api";
import { authStorage } from "./storage";
import type { LoginPayload, RegisterPayload } from "./types";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      authStorage.setSession(response.data.accessToken, response.data.user);
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const token = authStorage.getAccessToken();

      if (!token) {
        return { success: true, message: "No active session." };
      }

      return logout(token);
    },
    onSettled: () => {
      authStorage.clearSession();
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}
