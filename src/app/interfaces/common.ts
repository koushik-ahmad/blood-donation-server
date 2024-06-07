import { UserRole } from "@prisma/client";
import { IGenericErrorMessage } from "../errors/error";

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IAuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
} | null;
