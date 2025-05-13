import {z} from "zod";
import {LoginSchema} from "@/lib/schemas";

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export interface LoginTokenType {
    access: string;
    refresh: string;
}