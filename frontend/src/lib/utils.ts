import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {FieldPath, FieldValues, UseFormSetError} from "react-hook-form";
import {FieldError} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstCharacters(str: string) {
  return str.split(' ').map((word) => word.at(0)).join('');
}

export function handleFieldErrors<TFieldValues extends FieldValues>(errors: FieldError, setError: UseFormSetError<TFieldValues>) {
  let shouldFocus = true;
  for (const [field, error] of Object.entries(errors)) {
    setError(field as FieldPath<TFieldValues>, {
      message: error.join('. ')
    }, {shouldFocus});
    shouldFocus = false;
  }
}