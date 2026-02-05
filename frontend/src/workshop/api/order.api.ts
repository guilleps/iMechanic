import { apiCookie } from "@/shared/api/api";
import { Order } from "@/types/orders";
import { AxiosResponse } from "axios";
import { OrderRequest, OrderResponse } from "../models/order";

export const getWorkshopOrders = async (): Promise<Order[]> => {
  const { data } = await apiCookie.get<Order[]>("/orders");
  return data;
};

export const createOrder = async (
  request: OrderRequest,
): Promise<OrderResponse> => {
  const { data } = await apiCookie.post<OrderResponse>("/orders", request);
  return data;
};
