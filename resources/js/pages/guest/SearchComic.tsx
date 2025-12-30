import CardComic from "@/components/guest-comp/CardComic";
import HeaderPage from "@/components/guest-comp/HeaderPage";
import NoComic from "@/components/guest-comp/NoComic";
import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { Navbar } from "@/components/layouts/guest/Navbar";
import { IComicChapter } from "@/types/index.type";
import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchComic = () => {
    const [comics, setComics] = useState<IComicChapter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchQuery = searchParams.get("search") || "";

    const fetchComics = useCallback(async () => {
        setIsLoading(true);
        try {
            if (searchQuery) {
                const res = await axios.get(
                    `/api/comics?search=${searchQuery}`
                );
                setComics(res.data.data);
            } else {
                const res = await axios.get("/api/comics");
                setComics(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        fetchComics();
    }, [fetchComics]);

    // --- TAMBAHKAN FUNGSI INI: HANDLE SEARCH ---
    const handleSearch = (query: string) => {
        if (!query || query.trim() === "") {
            setSearchParams({}); // Hapus query params kalau kosong
        } else {
            setSearchParams({ search: query }); // Ubah URL jadi ?search=query
        }
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
