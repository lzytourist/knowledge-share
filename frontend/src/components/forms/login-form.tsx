'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FieldPath, useForm} from "react-hook-form";
import {FieldError, LoginSchemaType, UnauthorizedError} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/lib/schemas";
import PendingButton from "@/components/buttons/pending-button";
import Link from "next/link";
import {useTransition} from "react";
import {login} from "@/actions/auth";
import {toast} from "sonner";
import {LockIcon} from "lucide-react";
import {useRouter} from "next/navigation";

export default function LoginForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginSchemaType) => {
    startTransition(async () => {
      const token = await login(data);
      if (token.success) {
        toast.success('Login successful');
        form.reset();
        router.push('/');
      } else {
        if (token.status === 400) {
          const errors = token.errors as FieldError;
          for (const [field, messages] of Object.entries(errors)) {
            form.setError(field as FieldPath<LoginSchemaType>, {
              message: messages.join('. ')
            });
          }
        } else if (token.status === 401) {
          toast.error((token.errors as UnauthorizedError).detail)
        } else {
          toast.error('Wrong credentials');
        }
      }
    });
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
            <div className={'flex items-center justify-between'}>
              <FormLabel>Password</FormLabel>
              <Link className={'text-sm text-gray-400 hover:text-gray-200'} href={'/password-reset'}>Forgot your
                password?</Link>
            </div>
            <FormControl>
              <Input type={'password'} {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'password'}/>
        <PendingButton
          isPending={pending}
          className={'cursor-pointer w-full'}>
          Login
          <LockIcon/>
        </PendingButton>
      </form>
    </Form>
  )
}