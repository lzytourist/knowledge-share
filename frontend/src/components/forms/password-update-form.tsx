'use client'

import {FieldPath, useForm} from "react-hook-form";
import {FieldError, PasswordUpdateSchemaType} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {PasswordUpdateSchema} from "@/lib/schemas";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "@/components/ui/input";
import PendingButton from "@/components/buttons/pending-button";
import {useTransition} from "react";
import {authenticatedPostRequest} from "@/actions";
import {toast} from "sonner";

export default function PasswordUpdateForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<PasswordUpdateSchemaType>({
    resolver: zodResolver(PasswordUpdateSchema),
    defaultValues: {
      oldPassword: '',
      password1: '',
      password2: '',
    }
  });

  const onSubmit = (data: PasswordUpdateSchemaType) => {
    startTransition(async () => {
      const response = await authenticatedPostRequest<{ message: string }>('users/profile/password/', JSON.stringify({
        new_password: data.password1,
        old_password: data.oldPassword
      }));

      if ('status' in response) {
        if (response.status === 400) {
          for (const [field, messages] of Object.entries(response.data as FieldError)) {
            form.setError(field as FieldPath<PasswordUpdateSchemaType>, {
              message: messages.join(' ')
            });
          }

          if ('data' in response && 'non_field_errors' in response.data!) {
            toast.error((response.data.non_field_errors as string[]).join('. '))
          }
        } else {
          toast.error('Could not update password');
        }
      } else {
        toast.success('Password updated');
        form.reset();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-3'}>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Old password</FormLabel>
            <FormControl>
              <Input type={'password'} {...field}/>
            </FormControl>
            <FormDescription>Enter the current password</FormDescription>
            <FormMessage/>
          </FormItem>
        )} name={'oldPassword'}/>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
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
        <PendingButton isPending={pending} className={'cursor-pointer'}>Update</PendingButton>
      </form>
    </Form>
  );
}