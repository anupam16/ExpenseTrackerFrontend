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
    mutationFn: () => logout(),
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
