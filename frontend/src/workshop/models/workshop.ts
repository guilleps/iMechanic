import { OrderStatus } from '@/types/orders';

export type DashboardOrderItem = {
  id: number;
  brand: string;
  model: string;
  plate: string;
  customerName: string;
  status: OrderStatus
};

export type DashboardEmployee = {
  fullName: string;
  activeOrders: number;
};

export type WorkshopDashboard = {
  totalVehicles: number;
  inProcess: number;
  deliveredToday: number;
  monthlyIncome: number;
  activeOrders: DashboardOrderItem[];
  activeEmployees: DashboardEmployee[];
};
