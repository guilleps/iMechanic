import axios from "axios";
import type { RegisterRequest, Workshop } from "../models/Workshop";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const registerWorkshop = async (payload: RegisterRequest): Promise<Workshop> => {
  const { data } = await api.post<Workshop>("/auth/register", payload);
  return data;
};