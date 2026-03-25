import {
  TGetCategoryListResponseDto,
  TGetTaskDetailResponseDto,
  TGetTaskListRequestDto,
  TGetTaskListResponseDto,
} from "@/app/tasks/_config/task.schema"
import { api } from "@/lib/axios"

export async function getTaskList(
  params?: TGetTaskListRequestDto
): Promise<TGetTaskListResponseDto> {
  const response = await api.get("/tasks", { params })
  return response.data.data
}

export async function getTaskDetail(
  taskId: string
): Promise<TGetTaskDetailResponseDto> {
  const response = await api.get(`/tasks/${taskId}`)
  return response.data.data
}