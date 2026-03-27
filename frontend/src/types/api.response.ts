import z from "zod"

export const apiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    message: z.string(),
    data: schema,
  })

export type TApiResponse<T> = {
  message: string
  data: T
}

export type TApiErrorResponse = {
    message?: string | string[]
    statusCode?: number
}