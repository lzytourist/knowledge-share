'use client'

import {FieldPath, useForm} from "react-hook-form";
import {FieldError, PasswordResetType} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {PasswordResetSchema} from "@/lib/schemas";
import {useTransition} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import PendingButton from "@/components/buttons/pending-button";
import {resetPassword} from "@/actions/auth";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function PasswordResetForm({token}: {token: string}) {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<PasswordResetType>({
        resolver: zodResolver(PasswordResetSchema),
        defaultValues: {
            token: token,
            password1: '',
            password2: ''
        }
    });

    const onSubmit = (data: PasswordResetType) => {
        startTransition(async () => {
            const response = await resetPassword(data);
            
            if ('message' in response) {
                toast.success(response.message);
                form.reset();
                router.push('/');
            } else {
                if (response.status === 400) {
                    const errors = response.data as FieldError;
                    for (const [field, messages] of Object.entries(errors)) {
                        form.setError(field as FieldPath<PasswordResetType>, {
                            message: messages.join('. ')
                        });
                    }

                    if ('token' in errors) {
                        toast.error(errors['token'].join('. '), {position: 'top-right'})
                    }
                } else {
                    toast.error('Password reset failed');
                }
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-3'}>
                <FormField render={({field}) => (
                    <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                            <Input type={'password'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'password1'}/>
                <FormField render={({field}) => (
                    <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                            <Input type={'password'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'password2'}/>
                <PendingButton isPending={pending} className={'cursor-pointer w-full'}>Reset Password</PendingButton>
            </form>
        </Form>
    );
}