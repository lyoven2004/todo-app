import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { clearAuthCookies, getTokenFromCookie } from "./auth-cookie";
import { TApiErrorResponse } from "@/types/api.response";
import { logoutUser, refreshUserToken } from "@/axios/auth-api";

export class ApiError extends Error {
  status?: number

  constructor(message: string, options?: { status?: number }) {
    super(message)
    this.name = "ApiError"
    this.status = options?.status
  }
}


export interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  })

  instance.interceptors.request.use(async (config) => {
    const isRefresh = config.url?.includes("/auth/refresh")

    if (!isRefresh) {
      const token = await getTokenFromCookie("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  let isRefreshing = false
  let pendingRequests: ((token: string) => void)[] = []

  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const err = error as AxiosError<TApiErrorResponse>
      const res = err.response
      const originalRequest = err.config as RetryAxiosRequestConfig

      const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh")

      if (isRefreshRequest && res?.status === 401) {
        await logoutUser("Session expired, please login again")
        return Promise.reject(error)
      }

      if (res?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true

        if (isRefreshing) {
          return new Promise((resolve) => {
            pendingRequests.push((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(instance(originalRequest))
            })
          })
        }

        isRefreshing = true

        try {
          const newAccessToken = await refreshUserToken()

          pendingRequests.forEach((cb) => cb(newAccessToken))
          pendingRequests = []

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }

          return instance(originalRequest)
        } catch (refreshError) {
          pendingRequests.forEach((cb) => cb(""))
          pendingRequests = []
          
          await logoutUser("Session expired, please login again")
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      const backendMessage = res?.data?.message

      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage || err.message || "Something went wrong"

      return Promise.reject(
        new ApiError(message, {
          status: res?.status ?? res?.data?.statusCode,
        }),
      )
    }
  )
  return instance
}

export const api = createApiClient()
