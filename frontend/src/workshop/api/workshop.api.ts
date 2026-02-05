import { apiCookie } from "@/shared/api/api";
import { WorkshopDashboard } from "../models/workshop";

export const getWorkshopDashboard = async (): Promise<WorkshopDashboard> => {
  const { data } = await apiCookie.get<WorkshopDashboard>(
    "/workshops/dashboard",
  );
  return data;
};
