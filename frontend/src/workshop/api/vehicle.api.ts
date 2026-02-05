import { apiCookie } from "@/shared/api/api";
import { AxiosResponse } from "axios";
import { Vehicle, VehicleCreate, VehicleCreateResponse } from "../models/vehicle";

export const createVehicle = async (request: VehicleCreate): Promise<AxiosResponse<VehicleCreateResponse>> => {
    const response = await apiCookie.post<VehicleCreateResponse>(`/vehicles`, request);
    return response;
}

export const getAllVehicles = async (): Promise<AxiosResponse<VehicleCreateResponse[]>> => {
    const response = await apiCookie.get<VehicleCreateResponse[]>(`/vehicles`);
    return response;
}

export const searchVehicleByPlate = async (plate: string): Promise<AxiosResponse<Vehicle>> => {
    const response = await apiCookie.get<Vehicle>(`/vehicles/search/${plate}`);
    return response;
};