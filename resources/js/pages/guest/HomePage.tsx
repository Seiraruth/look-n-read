import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { IComicChapter, IGenre } from "@/types/index.type";
import axios from "axios";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layouts/guest/Navbar";
import CardComic from "@/components/guest-comp/CardComic";
import Footer from "@/components/layouts/guest/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Context } from "@/context/Context";
import useFetch from "@/hooks/use-fetch";

export default function HomePage() {
    const [comics, setComics] = useState<IComicChapter[]>([]);
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    const [genres, setGenres] = useState<IGenre[]>([]);

    const { isLoading } = useContext(Context);
    const { getAllComic } = useFetch();

    useEffect(() => {
        document.title = "Homepage";
    }, []);

    const fetchComics = useCallback(async () => {
        const data = await getAllComic();
        setComics(data.slice(0, 15));
    }, [setComics]);

    useEffect(() => {
        fetchComics();
    }, [fetchComics]);

    // Fetch All Genres
    const fetchGenres = useCallback(async () => {
        try {
            const response = await axios.get("/api/genres");
            setGenres(response.data.data);
        } catch (error) {
            console.log("Fetch Genres", error);
        }
    }, []);

    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <img src="/assets/gifs/zoro-loading.gif" alt="" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            {/* Main Content */}
            <GuestLayout>
                <section className="flex gap-5 w-full flex-col lg:flex-row">
                    {/* Latest Updates */}
                    <div className="mb-8 w-full lg:w-9/12 bg-neutral-900 p-5 rounded-md">
                        <div className="flex justify-between">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Latest Updates
                            </h2>
                            <Link to={`list-comic`}>
                                <Badge className="uppercase text-[10px]">
                                    View all
                                </Badge>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
                            {comics.length > 0 ? (
                                comics
                                    .filter((comic) => comic && comic.id)
                                    .map((comic) => (
                                        <Fragment key={comic.id}>
                                            <CardComic
                                                comic={comic}
                                                isLoading={isLoading}
                                            />
                                        </Fragment>
                                    ))
                            ) : (
                                <div className="col-span-4">
                                    <p className="text-destructive font-bold text-5xl">
                                        Comic Not Found 😱
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center items-center mt-20">
                            <Button variant={"outline"}>
                                <Link
                                    to={"/list-comic"}
                                    className="hover:text-purple-400 "
                                >
                                    Check Update Others{" "}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Genre Terbaru */}
                    <div className="mb-8 w-full lg:w-3/12">
                        <div className="bg-neutral-900 p-5 rounded-md">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Genre
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2">
                                {genres.length > 0 &&
                                    genres.map((genre) => (
                                        <Link
                                            to={`/genre/${genre.slug}`}
                                            key={genre.id}
                                        >
                                            <Button className="w-full">
                                                {genre.name}
                                            </Button>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
            </GuestLayout>

            <Footer />
        </>
    );
}
