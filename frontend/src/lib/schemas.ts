import {z} from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const PasswordResetRequestSchema = z.object({
    email: z.string().email()
});

export const PasswordResetSchema = z.object({
    token: z.string(),
    password1: z.string().min(6, {message: 'Password must be at least of 6 characters'}),
    password2: z.string()
}).refine((data) => data.password1 === data.password2, {
    message: 'Password do not match',
    path: ['password2']
});