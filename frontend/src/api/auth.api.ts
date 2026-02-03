import axios, { type AxiosResponse } from "axios";
import type { VerifyResponse } from "./models/Verify";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./models/Workshop";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

const apiWithCookie = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

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
  const { data } = await apiWithCookie.post<LoginResponse>(
    "/auth/login",
    payload,
  );
  console.log({data});
  return data;
};

export const refreshSession = async (): Promise<LoginResponse> => {
  const { data } = await apiWithCookie.post<LoginResponse>("/auth/refresh");
  return data;
};

export const logout = async () => {
  const { data } = await apiWithCookie.post("/auth/logout");
  return data as { message: string };
};

apiWithCookie.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshSession();
        return apiWithCookie(error.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
