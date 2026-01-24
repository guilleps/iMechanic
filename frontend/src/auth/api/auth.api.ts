import axios, { type AxiosResponse } from "axios";
import type { RegisterRequest, Workshop } from "../models/Workshop";
import type { VerifyResponse } from "../models/Verify";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const registerWorkshop = async (
  payload: RegisterRequest,
): Promise<Workshop> => {
  const { data } = await api.post<Workshop>("/auth/register", payload);
  return data;
};

export const verifyAccount = async (encodedToken: string): Promise<AxiosResponse<VerifyResponse>> => {
  const response = await api.get<VerifyResponse>(`/auth/verify-account/${encodedToken}`);
  return response;
};
