import { Order, OrderStatus } from "@/types/orders";

export const getOrdersByStatus = (status: OrderStatus, orders: Order[]): Order[] => {
  return orders.filter(order => order.status === status);
};

export const statusLabels: Record<OrderStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  READY: 'Listo',
  DELIVERED: 'Entregado',
};

export const statusColors: Record<OrderStatus, string> = {
  OPEN: 'bg-status-info',
  IN_PROGRESS: 'bg-status-progress',
  READY: 'bg-status-progress',
  DELIVERED: 'bg-secondary',
};
