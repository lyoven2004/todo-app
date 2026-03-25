import axios, { AxiosError, AxiosInstance } from "axios";
import { getTokenFromCookie } from "./auth-cookie";

export class ApiError extends Error {
  status?: number
  code?: string
  field?: string

  constructor(
    message: string,
    options?: {
      status?: number
      code?: string
      field?: string
    },
  ) {
    super(message)
    this.name = "ApiError"
    this.status = options?.status
    this.code = options?.code
    this.field = options?.field
  }
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // headers: {
    //   "Content-Type": "application/json",
    //   "Authorization": `Bearer ${token}`
    // },
    withCredentials: true,
  })

  instance.interceptors.request.use(async (config) => {
    const token = await getTokenFromCookie('accessToken')

    // if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
      const res = error.response

      return Promise.reject(
        new ApiError(res?.data?.message || error.message || "Something went wrong", {
          status: res?.status,
          code: res?.data?.code,
          field: res?.data?.field,
        }),
      )
    },
  )

  return instance
}

export const api = createApiClient()
