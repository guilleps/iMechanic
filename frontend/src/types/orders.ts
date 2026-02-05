import { Vehicle } from "@/workshop/models/vehicle";

export type OrderStatus = "OPEN" | "IN_PROGRESS" | "READY" | "DELIVERED";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Mechanic {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
}

export type ItemStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED"

export interface ServiceItem {
  name: string;
  status: ItemStatus;
}

export interface TimelineEvent {
  id: string;
  type: "status_change" | "note" | "photo" | "service_update";
  title: string;
  description: string;
  timestamp: Date;
  author: string;
  images?: string[];
}

export interface Order {
  id: string;
  // orderNumber: string;
  vehicle: Vehicle;
  customer: Customer;
  status: OrderStatus;
  services: ServiceItem[];
  // timeline: TimelineEvent[];
  // createdAt: Date;
  // updatedAt: Date;
  // estimatedCompletion?: Date;
  // subtotal: number;
  // tax: number;
  // total: number;
  // notes?: string;
  totalCost: number;
}
