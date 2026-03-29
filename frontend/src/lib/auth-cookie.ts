"use server"

import { cookies } from "next/headers"

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"

export async function setAuthCookies(params: {
    accessToken: string
    refreshToken: string
}) {
    const cookieStore = await cookies()

    cookieStore.set(ACCESS_TOKEN_KEY, params.accessToken, {
        httpOnly: true,
        sameSite: "lax",
    })

    cookieStore.set(REFRESH_TOKEN_KEY, params.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
    })
}

export async function clearAuthCookies() {
    const cookieStore = await cookies()
    cookieStore.delete(ACCESS_TOKEN_KEY)
    cookieStore.delete(REFRESH_TOKEN_KEY)
}

export async function getTokenFromCookie(key: string) {
    const cookieStore = await cookies()
    return cookieStore.get(key)?.value ?? null
}