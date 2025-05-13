import {z} from "zod";
import {LoginSchema, PasswordResetRequestSchema, PasswordResetSchema} from "@/lib/schemas";

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type PasswordResetRequestType = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetType = z.infer<typeof PasswordResetSchema>;

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

export interface ApiError {
    status?: number;
    data?: UnauthorizedError | FieldError;
}
