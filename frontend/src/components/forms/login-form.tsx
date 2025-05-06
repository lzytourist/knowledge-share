'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {LoginSchemaType} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/lib/schemas";
import PendingButton from "@/components/buttons/pending-button";

export default function LoginForm() {
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginSchemaType) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-4'}>
                <FormField render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type={'email'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'email'}/>
                <FormField render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type={'password'} {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} name={'password'}/>
                <PendingButton isPending={true}>Login</PendingButton>
            </form>
        </Form>
    )
}