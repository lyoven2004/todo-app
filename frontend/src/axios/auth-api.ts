import { fetchData } from "@/lib/fetch";
import type {
  TAuthSuccessResponse,
  TLoginRequestDto,
  TLoginResponseDto,
} from "@/app/login/_config/login.schema";
import { TApiResponse } from "@/types/api.response";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type TBackendLoginData = TLoginResponseDto;

export async function loginUser(
  payload: TLoginRequestDto,
): Promise<TAuthSuccessResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetchData<TApiResponse<TBackendLoginData>>({
    url: `${API_URL}/auth/login`,
    method: "POST",
    body: payload,
  });

  const data = response.data;

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken
  };
}