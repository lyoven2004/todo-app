import { z } from "zod"

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address")

export const loginPasswordSchema = z
  .string()
  .min(1, "Password is required")

export const registerPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must include uppercase, lowercase, and a number"
  )

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")


// LOGIN

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