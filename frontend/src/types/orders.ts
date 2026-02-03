export type OrderStatus = 'recepcion' | 'diagnostico' | 'reparacion' | 'pruebas' | 'listo';

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Mechanic {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  mechanicId: string;
  mechanic?: Mechanic;
  price: number;
  laborCost: number;
  partsCost: number;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedTime?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'note' | 'photo' | 'service_update';
  title: string;
  description: string;
  timestamp: Date;
  author: string;
  images?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  vehicle: Vehicle;
  client: Client;
  status: OrderStatus;
  services: ServiceItem[];
  timeline: TimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion?: Date;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}
