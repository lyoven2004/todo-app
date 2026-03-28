import { z } from "zod"

export const categorySchema = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string().optional(),
})

export const getCategoryListRequestSchema = z.object({
    search: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
})

export const getCategoryListResponseSchema = z.object({
    data: z.array(categorySchema),
    total: z.number(),
    totalPage: z.number(),
    page: z.number(),
    limit: z.number(),
})

export const getCategoryListSimpleResponseSchema = z.array(categorySchema)

export type TCategoryDto = z.infer<typeof categorySchema>
export type TGetCategoryListRequestDto = z.infer<typeof getCategoryListRequestSchema>
export type TGetCategoryListResponseDto = z.infer<typeof getCategoryListResponseSchema>
export type TGetCategoryListSimpleResponseDto = z.infer<typeof getCategoryListSimpleResponseSchema>