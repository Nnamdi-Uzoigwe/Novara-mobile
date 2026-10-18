import { apiFetch } from "@/core/api/client";
import type { AuthResponse } from "@/core/api/types";

type Message = { message: string };

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    apiFetch<{ email: string; message: string }>("/auth/register", {
      method: "POST",
      body,
      auth: false,
    }),

  verifyEmail: (body: { email: string; code: string }) =>
    apiFetch<AuthResponse>("/auth/verify-email", {
      method: "POST",
      body,
      auth: false,
    }),

  resendCode: (email: string, purpose: "verify_email" | "reset_password") =>
    apiFetch<Message>("/auth/resend-code", {
      method: "POST",
      body: { email, purpose },
      auth: false,
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body,
      auth: false,
    }),

  logout: (refreshToken: string) =>
    apiFetch<Message>("/auth/logout", {
      method: "POST",
      body: { refreshToken },
      auth: false,
    }),

  forgotPassword: (email: string) =>
    apiFetch<Message>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    }),

  verifyResetCode: (email: string, code: string) =>
    apiFetch<{ resetToken: string }>("/auth/verify-reset-code", {
      method: "POST",
      body: { email, code },
      auth: false,
    }),

  resetPassword: (resetToken: string, password: string) =>
    apiFetch<Message>("/auth/reset-password", {
      method: "POST",
      body: { resetToken, password },
      auth: false,
    }),
};
