import type {
  TLoginRequestDto,
  TLoginResponseDto,
} from "@/app/login/_config/login.schema";
import { TRegisterRequestDto, TRegisterResponseDto } from "@/app/register/_config/register.schema";
import { clearAuthCookies, getTokenFromCookie, setAuthCookies } from "@/lib/auth-cookie";
import { api } from "@/lib/axios";

export async function loginUser(
  payload: TLoginRequestDto,
): Promise<TLoginResponseDto> {

  const response = await api.post("/auth/login", payload)
  return response.data.data
}

export async function registerUser(
  payload: TRegisterRequestDto,
): Promise<TRegisterResponseDto> {
  const response = await api.post("/auth/register", payload)
  return response.data.data
}

export async function refreshUserToken(): Promise<string> {
  const refreshToken = await getTokenFromCookie("refreshToken")

  if (!refreshToken) {
    throw new Error("No refresh token")
  }

  const response = await api.post(
    "/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
      withCredentials: true,
    }
  )

  const { accessToken, refreshToken: newRefreshToken } = response.data.data

  await setAuthCookies({
    accessToken,
    refreshToken: newRefreshToken,
  })

  return accessToken
}

export async function logoutUser(reason?: string) {
  try {
    await api.post("/auth/logout")
  } catch (_) {
  } finally {
    await clearAuthCookies()

    if (typeof window !== "undefined") {
      if (reason) {
        localStorage.setItem("auth_message", reason)
      }
      window.location.href = "/login"
    }
  }
}