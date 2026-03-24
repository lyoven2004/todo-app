import axios from "axios";
import { clearSessionTokens, getAccessToken } from "./session";

export class ApiError extends Error {
  status?: number;
  code?: string;
  field?: string;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      field?: string;
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.field = options?.field;
  }
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: auto attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: normalize error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;

    if (res?.status === 401) {
      clearSessionTokens();
    }

    throw new ApiError(res?.data?.message || "Something went wrong", {
      status: res?.status,
      code: res?.data?.code,
      field: res?.data?.field,
    });
  },
);