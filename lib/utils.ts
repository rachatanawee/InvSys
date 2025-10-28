
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Since we cannot import libs, here's a lightweight version.
// In a real project, you'd install clsx and tailwind-merge.
// For this environment, we'll just use a basic joiner.
export const cnLite = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
}
