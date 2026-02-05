export type ServiceRequest = {
  name: string;
  description: string;
  category: CategoryService;
  basePrice: number;
};

export type ServiceResponse = {
  name: string;
  description: string;
  category: string;
  basePrice: number;
  active: boolean;
};

export type CategoryService = "MAINTENANCE" | "REPAIR";
