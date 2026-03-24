import type {
  TLoginRequestDto,
  TLoginResponseDto,
} from "@/app/login/_config/login.schema";
import { api } from "@/lib/axios";

export async function loginUser(
  payload: TLoginRequestDto,
): Promise<TLoginResponseDto> {

  const response = await api.post("/auth/login", payload)
  return response.data.data
}