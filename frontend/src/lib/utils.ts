import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getFirstCharacters(str: string) {
    return str.split(' ').map((word) => word.at(0)).join('');
}
