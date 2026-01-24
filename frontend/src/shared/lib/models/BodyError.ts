export type FieldError = {
  field: string;
  message: string;
};

export type BodyError = {
  code: string;
  message: string;
  status: number;
  path: string;
  timestamp: string;
  fieldErrors?: FieldError[] | null;
};
