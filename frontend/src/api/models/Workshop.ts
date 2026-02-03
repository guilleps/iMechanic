import type { Role } from "@/shared/auth/useAuth";

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  message: string;
  role: Role;
  expiresIn: number;
}

export type RegisterRequest = {
  workshopName: string;
  ownerName: string;
  email: string;
  password: string;
  address?: string;
  phone: string;
}

export type RegisterResponse = {
  message: string;
  email: string;
  verificationRequired: boolean;
};