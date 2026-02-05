import { apiCookie } from "@/shared/api/api";
import { ServiceRequest } from "../models/service";
import { ServiceResponse } from "../models/order";

export const createService = async (
  request: ServiceRequest,
): Promise<ServiceResponse> => {
  const { data } = await apiCookie.post<ServiceResponse>("/services", request);
  return data;
};

export const getAllServices = async (): Promise<ServiceResponse[]> => {
  const { data } = await apiCookie.get("/services");
  return data;
};
