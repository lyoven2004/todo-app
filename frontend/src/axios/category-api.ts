import {
  TCategoryDto,
  TGetCategoryListRequestDto,
  TGetCategoryListResponseDto,
} from "@/app/categories/_config/category.schema"
import { api } from "@/lib/axios"

export async function getCategoryList(
  params?: TGetCategoryListRequestDto
): Promise<TGetCategoryListResponseDto> {
  const response = await api.get("/categories", { params })
  return response.data.data
}

export async function createCategory(
  data: { name: string }
): Promise<TCategoryDto> {
  const response = await api.post("/categories", data)
  return response.data.data
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await api.delete(`/categories/${categoryId}`)
}