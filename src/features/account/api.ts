import { apiFetch } from "@/core/api/client";
import type { ApiUser, Tokens } from "@/core/api/types";

export const accountApi = {
  me: () => apiFetch<{ user: ApiUser }>("/me"),

  updateMe: (body: { name?: string; avatarUrl?: string | null }) =>
    apiFetch<{ user: ApiUser }>("/me", { method: "PATCH", body }),

  deleteMe: (password?: string) =>
    apiFetch<{ message: string }>("/me", {
      method: "DELETE",
      body: { password },
    }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ tokens: Tokens }>("/auth/change-password", {
      method: "POST",
      body,
    }),
};
