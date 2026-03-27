import { nullable, z } from "zod"

export const taskSortBySchema = z.enum([
  "newest",
  "oldest",
  "dueDate",
  "priority"
])

export const taskStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "DONE",
  "FAILED",
])

export const taskPrioritySchema = z.enum([
  "HIGH",
  "MEDIUM",
  "LOW",
])

export const taskCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
})

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  expiredAt: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
})

export const taskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  categoryId: z.string().nullable().optional(),
  expiredAt: z.string().nullable().optional(),
})

export const getTaskListRequestSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  categoryId: z.string().optional(),
  sortBy: z.enum(["createdAt", "expiredAt", "priority"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

export const getTaskListResponseSchema = z.object({
  data: z.array(taskItemSchema),
  total: z.number(),
  totalPage: z.number(),
  page: z.number(),
  limit: z.number(),
})

export const getTaskDetailResponseSchema = taskItemSchema

export const getCategoryListResponseSchema = z.array(taskCategorySchema)

export type TTaskFormMode = "create" | "edit"
export type TTaskSortBy= z.infer<typeof taskSortBySchema>
export type TTaskStatus = z.infer<typeof taskStatusSchema>
export type TTaskPriority = z.infer<typeof taskPrioritySchema>
export type TTaskItemDto = z.infer<typeof taskItemSchema>
export type TTaskCategoryDto = z.infer<typeof taskCategorySchema>
export type TGetTaskListRequestDto = z.infer<typeof getTaskListRequestSchema>
export type TGetTaskListResponseDto = z.infer<typeof getTaskListResponseSchema>
export type TGetTaskDetailResponseDto = z.infer<typeof getTaskDetailResponseSchema>
export type TGetCategoryListResponseDto = z.infer<typeof getCategoryListResponseSchema>
export type TTaskFormValues = z.infer<typeof taskFormSchema>