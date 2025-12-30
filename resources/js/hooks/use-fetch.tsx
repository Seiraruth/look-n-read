import { Context } from "@/context/Context";
import axios from "axios";
import { useContext } from "react";

interface IComicParams {
    type?: string;
    status?: string;
    genre?: string;
    search?: string;
}

const useFetch = () => {
    const { setIsLoading } = useContext(Context);
    const getAllComic = async (filters?: IComicParams) => {
        setIsLoading(true);
        try {
            // console.log(filters);
            const params: {
                type?: string;
                status?: string;
                genre?: string;
                search?: string;
            } = {};

            if (filters?.type) params.type = filters.type;
            if (filters?.status) params.status = filters.status;
            if (filters?.genre) params.genre = filters.genre;
            if (filters?.search) params.search = filters.search;

            const res = await axios.get("/api/comics", {
                params: params,
            });
            return res.data.data;
        } catch (error) {
            console.error("Fetch Comic", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { getAllComic };
};

export default useFetch;
