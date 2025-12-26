import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { id } from "date-fns/locale/id";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const customIdLocale = {
    ...id,
    formatDistance: (token: any, count: any, options: any) => {
        const originalOutput = id.formatDistance(token, count, options);

        return originalOutput.replace(/sekitar\s/i, "");
    },
};
