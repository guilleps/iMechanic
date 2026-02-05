export type OrderRequest = {
  plate: string;
  description?: string;
  items: OrderItemRequest[];
};

export type OrderItemRequest = {
  serviceId: number;
  employeeId: number;
};

export type OrderResponse = {
    vehicle: VehicleResponse;
    item: ItemResponse[];
    totalCost: number;
}

export type VehicleResponse = {
    id: number;
    plate: string;
    customer: CustomerResponse;
}

export type CustomerResponse = {
    id: number;
    fullName: string;
}

export type ItemResponse = {
    id: number;
    service: ServiceResponse;
    price: number;
}

export type ServiceResponse = {
    name: string;
    description: string;
    category: string;
    basePrice: number;
    active: boolean;
}
