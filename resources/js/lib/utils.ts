import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { id } from "date-fns/locale/id";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const customIdLocale = {
    ...id,
    formatDistance: (token: any, count: any, options: any) => {
        let result = id.formatDistance(token, count, options);

        if (result === "setengah menit") {
            return "30 detik";
        }

        result = result.replace(/sekitar /i, "");
        result = result.replace(/kurang dari /i, "");

        return result;
    },
};
