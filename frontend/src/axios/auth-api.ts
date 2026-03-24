import type {
  TLoginRequestDto,
  TLoginResponseDto,
} from "@/app/login/_config/login.schema";
import { TApiResponse } from "@/types/api.response";
import { TRegisterRequestDto, TRegisterResponseDto } from "@/app/register/_config/register.schema";
import { api } from "@/lib/axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TBackendLoginData = TLoginResponseDto;

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