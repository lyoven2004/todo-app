import { api } from "./axios"

export async function fetchData<T>({
  url,
  method = "GET",
  body,
}: {
  url: string
  method?: string
  body?: unknown
}): Promise<T> {
  const res = await api.request<T>({
    url,
    method,
    data: body,
  })

  return res.data
}