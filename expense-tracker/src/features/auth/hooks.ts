import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, login, logout, register } from "./api";
import { authStorage } from "./storage";
import type { LoginPayload, RegisterPayload } from "./types";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      authStorage.setSession(response.data.accessToken, response.data.user);
      queryClient.removeQueries({ queryKey: ["auth-me"] });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      authStorage.clearSession();
      queryClient.removeQueries({ queryKey: ["auth-me"] });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}

export function useMyProfileQuery() {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: getMyProfile,
    enabled: authStorage.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}
