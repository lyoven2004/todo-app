import { emailSchema } from "@/types/validation"
import { z } from "zod"

export const registerPasswordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, "Full name is required")
            .max(100, "Full name is too long"),
        email: emailSchema.transform((v) => v.toLowerCase().trim()),
        password: registerPasswordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type TRegisterFormValues = z.infer<typeof registerSchema>

export const registerRequestSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
})

export type TRegisterRequestDto = z.infer<typeof registerRequestSchema>

export const registerResponseSchema = z.object({
    message: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string(),
    }),
})

export type TRegisterResponseDto = z.infer<typeof registerResponseSchema>

export type TRegisterApiError = {
    message: string
    code?: string
    field?: "fullName" | "email" | "password" | "confirmPassword" | "agreeToTerms"
}