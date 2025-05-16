'use client'

import {FieldPath, useForm} from "react-hook-form";
import {AuthUser, FieldError, ProfileUpdateType} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProfileUpdateSchema} from "@/lib/schemas";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "@/components/ui/input";
import PendingButton from "@/components/buttons/pending-button";
import {useTransition} from "react";
import {authenticatedPostRequest} from "@/actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function ProfileUpdateForm({user}: { user: AuthUser }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<ProfileUpdateType>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email
    }
  });

  const router = useRouter();

  const onSubmit = (data: ProfileUpdateType) => {
    startTransition(async () => {
      const response = await authenticatedPostRequest<AuthUser>('users/profile/', JSON.stringify(data));

      if ('status' in response) {
        if (response.status === 400) {
          for (const [field, messages] of Object.entries(response.data as FieldError)) {
            form.setError(field as FieldPath<ProfileUpdateType>, {
              message: messages.join('. ')
            });
          }
        } else {
          toast.error('Could not update profile');
        }
      } else {
        toast.success('Profile updated');
        router.refresh();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-3'}>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'name'}/>
        <FormField render={({field}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type={'email'} {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'email'}/>
        <PendingButton isPending={pending} className={'cursor-pointer'}>Update</PendingButton>
      </form>
    </Form>
  );
}