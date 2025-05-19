import {z} from "zod";
import {
  LoginSchema,
  PasswordResetRequestSchema,
  PasswordResetSchema,
  PasswordUpdateSchema,
  ProfileUpdateSchema
} from "@/lib/schemas";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type PasswordResetRequestType = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetType = z.infer<typeof PasswordResetSchema>;
export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;
export type PasswordUpdateSchemaType = z.infer<typeof PasswordUpdateSchema>;

export interface LoginTokenType {
  access: string;
  refresh: string;
}

export interface FieldError {
  [key: string]: string[]
}

export interface UnauthorizedError {
  detail: string;
  code: 'access' | 'refresh'
}

export interface APIResponse<T> {
  success: boolean;
  status: number;
  statusText: string;
  data?: T;
  errors?: UnauthorizedError | FieldError;
}

export interface ApiError {
  status?: number;
  data?: UnauthorizedError | FieldError;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}