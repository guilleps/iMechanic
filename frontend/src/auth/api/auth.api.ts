import { api, apiCookie, refreshClient } from "@/shared/api/api";
import { type AxiosResponse } from "axios";
import type { VerifyResponse } from "../models/Verify";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../models/Workshop";

export const registerWorkshop = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
};

export const verifyAccount = async (
  encodedToken: string,
): Promise<AxiosResponse<VerifyResponse>> => {
  const response = await api.get<VerifyResponse>(
    `/auth/verify-account/${encodedToken}`,
  );
  return response;
};

export const loginWorkshop = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const { data } = await apiCookie.post<LoginResponse>("/auth/login", payload);
  return data;
};

export const refreshSession = async (): Promise<LoginResponse> => {
  // Use the refreshClient without interceptors to prevent recursive 401 loops
  const { data } = await refreshClient.post<LoginResponse>("/auth/refresh");
  return data;
};

export const logout = async () => {
  const { data } = await apiCookie.post("/auth/logout");
  return data as { message: string };
};

apiCookie.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If 401 from refresh endpoint itself, do not attempt to refresh again
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !isRefreshCall) {
      // Prevent multiple retries for the same request
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshSession();
          return apiCookie(originalRequest);
        } catch {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
