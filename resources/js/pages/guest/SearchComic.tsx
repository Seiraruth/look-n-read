import CardComic from "@/components/guest-comp/CardComic";
import HeaderPage from "@/components/guest-comp/HeaderPage";
import NoComic from "@/components/guest-comp/NoComic";
import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { Navbar } from "@/components/layouts/guest/Navbar";
import { Context } from "@/context/Context";
import useFetch from "@/hooks/use-fetch";
import { IComicChapter } from "@/types/index.type";
import axios from "axios";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchComic = () => {
    const [comics, setComics] = useState<IComicChapter[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading } = useContext(Context);
    const { getAllComic } = useFetch();

    const searchQuery = searchParams.get("search") || "";

    const fetchComics = useCallback(async () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const data = await getAllComic({ search: searchQuery });
        setComics(data);
    }, [searchQuery]);

    useEffect(() => {
        fetchComics();
    }, [fetchComics]);

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(searchParams);
        if (!query || query.trim() === "") {
            params.delete("search");
        } else {
            params.set("search", query);
        }
        setSearchParams(params);
    };

    return (
        <>
            <Navbar onSearchSubmit={handleSearch} />

            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <img src="/assets/gifs/zoro-loading.gif" alt="" />
                </div>
            ) : (
                <GuestLayout>
                    <HeaderPage>
                        <p className="text-2xl font-bold">
                            Hasil Pencarian: {searchQuery.split("+").join(" ")}
                        </p>
                    </HeaderPage>

                    {comics.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {comics.map((comic) => (
                                <Fragment key={comic.id}>
                                    <CardComic
                                        comic={comic}
                                        isLoading={isLoading}
                                    />
                                </Fragment>
                            ))}
                        </div>
                    ) : (
                        <NoComic>No Comic 😴</NoComic>
                    )}
                </GuestLayout>
            )}

            {/* Footer */}
        </>
    );
};

export default SearchComic;
