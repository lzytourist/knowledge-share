'use client'

import {FieldPath, useForm} from "react-hook-form";
import {FieldError, PasswordResetRequestType} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {PasswordResetRequestSchema} from "@/lib/schemas";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import PendingButton from "@/components/buttons/pending-button";
import {useTransition} from "react";
import {requestPasswordReset} from "@/actions/auth";
import {toast} from "sonner";

export default function PasswordResetRequestForm() {
    const [pending, startTransition] = useTransition();

    const form = useForm<PasswordResetRequestType>({
        resolver: zodResolver(PasswordResetRequestSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = (data: PasswordResetRequestType) => {
        console.log(data);
        startTransition(async () => {
            const response = await requestPasswordReset(data);
            console.log(response)

            if ('message' in response) {
                toast.success(response.message);
                form.reset();
            } else {
                if (response.status === 400) {
                    for (const [field, messages] of Object.entries(response.data as FieldError)) {
                        form.setError(field as FieldPath<PasswordResetRequestType>, {
                            message: messages.join('. ')
                        });
                    }
                }
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-3'}>
                <FormField render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type={'email'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'email'}/>
                <PendingButton isPending={pending} className={'cursor-pointer w-full'}>Request Password Reset</PendingButton>
            </form>
        </Form>
    );
}