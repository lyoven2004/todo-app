"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../../axios/auth-api";
import type {
  TAuthApiError,
  TAuthSuccessResponse,
  TLoginFormValues,
  TLoginRequestDto,
} from "@/app/login/_config/login.schema";
import { ApiError } from "@/lib/axios";
import { setSessionTokens } from "@/lib/session";

export function mapApiErrorToFormField(error: unknown): TAuthApiError | null {
  if (error instanceof ApiError) {
    if (error.field === "email" || error.field === "password") {
      return {
        field: error.field,
        message: error.message,
        code: error.code,
      };
    }

    if (error.status === 401) {
      return {
        field: "password",
        message: "Email or password is incorrect",
        code: error.code ?? "INVALID_CREDENTIALS",
      };
    }
  }

  return null;
}

export function getAuthErrorMessage(code?: string) {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return "Email or password is incorrect.";
    case "USER_NOT_FOUND":
      return "Account does not exist.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please try again later.";
    default:
      return "Unable to sign in. Please try again.";
  }
}

export function useLogin(options?: {
  onSuccess?: (data: TAuthSuccessResponse) => void;
  onError?: (error: TAuthApiError | ApiError) => void;
  redirectTo?: string;
}) {
  const router = useRouter();

  return useMutation<TAuthSuccessResponse, ApiError, TLoginRequestDto>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setSessionTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      options?.onSuccess?.(data);
      router.push(options?.redirectTo ?? "/");
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}