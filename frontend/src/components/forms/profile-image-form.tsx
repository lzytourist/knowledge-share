'use client'

import {useForm} from "react-hook-form";
import {FieldError, ProfileImageSchemaType} from "@/lib/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProfileImageSchema} from "@/lib/schemas";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "@/components/ui/input";
import PendingButton from "@/components/buttons/pending-button";
import {useTransition} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {uploadProfileImage} from "@/actions/auth";
import {handleFieldErrors} from "@/lib/utils";

export default function ProfileImageForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<ProfileImageSchemaType>({
    resolver: zodResolver(ProfileImageSchema),
    defaultValues: {
      image: undefined,
    }
  });

  const router = useRouter();

  const onSubmit = (data: ProfileImageSchemaType) => {
    startTransition(async () => {
      const response = await uploadProfileImage(data);

      if (!response.success) {
        if (response.status === 400) {
          handleFieldErrors<ProfileImageSchemaType>(response.errors as FieldError, form.setError);
        } else {
          toast.error('Image could not be uploaded');
        }
      } else {
        toast.success('Profile image updated');
        form.reset();
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
              <Input type={'file'} accept={'image/*'} onChange={(e) => field.onChange(e.target.files![0])}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'image'}/>
        <PendingButton isPending={pending} className={'cursor-pointer'}>Upload</PendingButton>
      </form>
    </Form>
  );
}