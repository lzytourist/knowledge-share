import {z} from "zod";
import {LoginSchema} from "@/lib/schemas";

export type LoginSchemaType = z.infer<typeof LoginSchema>;