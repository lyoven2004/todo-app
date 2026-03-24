
import type {
  TLoginRequestDto,
  TLoginResponseDto,
} from "@/app/login/_config/login.schema";
import { api } from "@/lib/axios";
import { TApiResponse } from "@/types/api.response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TBackendLoginData = TLoginResponseDto;

export async function loginUser(
  payload: TLoginRequestDto,
): Promise<TLoginResponseDto> {

  const response = await api.post("/auth/login", payload)
  return response.data.data
}