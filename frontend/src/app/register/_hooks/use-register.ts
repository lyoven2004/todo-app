"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { registerUser } from "../../../axios/auth-api"
import type {
  TRegisterApiError,
  TRegisterRequestDto,
  TRegisterResponseDto,
} from "@/app/register/_config/register.schema"
import { ApiError } from "@/lib/axios"

export function getRegisterErrorMessage(code?: string) {
  switch (code) {
    case "EMAIL_ALREADY_EXISTS":
      return "This email is already registered."
    case "INVALID_INPUT":
      return "Please check your input and try again."
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please try again later."
    default:
      return "Unable to create account. Please try again."
  }
}

export function useRegister(options?: {
  onSuccess?: (data: TRegisterResponseDto) => void
  onError?: (error: TRegisterApiError | ApiError) => void
  redirectTo?: string
}) {
  const router = useRouter()

  return useMutation<TRegisterResponseDto, ApiError, TRegisterRequestDto>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      options?.onSuccess?.(data)
      router.push(options?.redirectTo ?? "/login")
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}