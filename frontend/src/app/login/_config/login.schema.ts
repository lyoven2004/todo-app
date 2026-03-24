import { emailSchema } from "@/types/validation"
import { z } from "zod"

export const loginPasswordSchema = z
  .string()
  .min(1, "Password is required")

export const loginSchema = z.object({
  email: emailSchema.transform((v) => v.toLowerCase()),
  password: loginPasswordSchema,
})
export type TLoginFormValues = z.infer<typeof loginSchema>

export const loginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
})
export type TLoginRequestDto = z.infer<typeof loginRequestSchema>

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})
export type TLoginResponseDto = z.infer<typeof loginResponseSchema>

// AUTH SUCCESS RESPONSE (COMBINED)
export type TAuthSuccessResponse = {
  accessToken: string
  refreshToken: string
}

// AUTH ERROR TYPE
export type TAuthApiError = {
  message: string
  code?: string
  field?: "email" | "password"
}