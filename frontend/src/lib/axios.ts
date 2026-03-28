import axios, { AxiosError, AxiosInstance } from "axios";
import { clearAuthCookies, getTokenFromCookie } from "./auth-cookie";
import { TApiErrorResponse } from "@/types/api.response";

export class ApiError extends Error {
  status?: number

  constructor(message: string, options?: { status?: number }) {
    super(message)
    this.name = "ApiError"
    this.status = options?.status
  }
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  })

  instance.interceptors.request.use(async (config) => {
    const token = await getTokenFromCookie('accessToken')
    config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<TApiErrorResponse>) => {
      const res = error.response
      const backendMessage = res?.data?.message

      if (res?.status === 401) {
        if (typeof window !== "undefined") {
          clearAuthCookies()
          window.location.href = "/login"
        }

        return Promise.reject(new ApiError("Session expired", { status: 401 }))
      }

      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || error.message || "Something went wrong"

      return Promise.reject(
        new ApiError(message, {
          status: res?.status ?? res?.data?.statusCode,
        }),
      )
    },
  )
  return instance
}

export const api = createApiClient()
