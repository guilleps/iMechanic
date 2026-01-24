export type RegisterRequest = {
  workshopName: string;
  ownerName: string;
  email: string;
  password: string;
  address?: string;
  phone: string;
}

export type Workshop = {
  message: string;
  workshopId: number;
  adminId: number;
};