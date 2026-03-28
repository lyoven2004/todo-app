import {
  // TGetCategoryListResponseDto,
  TGetTaskDetailResponseDto,
  TGetTaskListRequestDto,
  TGetTaskListResponseDto,
  TTaskItemDto,
} from "@/app/tasks/_config/task.schema"
import { api } from "@/lib/axios"

export async function getTaskList(
  params?: TGetTaskListRequestDto
): Promise<TGetTaskListResponseDto> {
  const response = await api.get("/tasks", { params })
  return response.data.data
}

export async function createTask(
  data: Partial<TTaskItemDto>
): Promise<TGetTaskDetailResponseDto> {
  const response = await api.post("/tasks", data)
  return response.data.data
}

export async function updateTask(
  taskId: string,
  data: Partial<TTaskItemDto>
): Promise<TGetTaskDetailResponseDto> {
  const response = await api.patch(`/tasks/${taskId}`, data)
  return response.data.data
}

export async function deleteTask(taskId: string) {
  const response = await api.delete(`/tasks/${taskId}`)
  return response.data.data
}