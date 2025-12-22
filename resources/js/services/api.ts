import axios from "axios";
import { VITE_API_COMICS } from "./env";

export const getApi = async (resource: string, query?: string) => {
    try {
        const response = await axios.get(
            `${VITE_API_COMICS}/${resource}?${query}`
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};
