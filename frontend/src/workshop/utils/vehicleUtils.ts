export const initialVehicleState = {
  plate: "",
  brand: "",
  model: "",
  year: "",
  firstName: "",
  lastName: "",
  phone: "",
};

export const formatPlate = (raw: string) => {
  const alnum = raw
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);
  return alnum.length <= 3 ? alnum : `${alnum.slice(0, 3)}-${alnum.slice(3)}`;
};

export const isValidPhone = (phone: string) => /^9\d{8}$/.test(phone);
