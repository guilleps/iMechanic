export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  firstName: string;
  lastName: string;
}

export type VehicleCreate = {
    plate: string;
    model: string;
    brand: string;
    year: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export type VehicleCreateResponse = {
    plate: string;
    model: string;
    brand: string;
    year: string;
    firstName: string;
    lastName: string;
    phone: string;
}