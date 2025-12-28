import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { IComicChapter, IGenre } from "@/types/index.type";
import axios from "axios";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layouts/guest/Navbar";
import CardComic from "@/components/guest-comp/CardComic";
import Footer from "@/components/layouts/guest/Footer";
import { Button } from "@/components/ui/button";
import NoComic from "@/components/guest-comp/NoComic";
import { Context } from "@/context/Context";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
    const [comics, setComics] = useState<IComicChapter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [expandedCategory, setExpandedCategory] = useState<string | null>(
    //     null
    // );
    // const [categoryComics, setCategoryComics] = useState<IComicChapter[]>([]);
    // const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const {
        categoryComics,
        isCategoryLoading,
        expandedCategory,
        setExpandedCategory,
        setCategoryComics,
        setIsCategoryLoading,
    } = useContext(Context);

    useEffect(() => {
        document.title = "Homepage - guest";
    }, []);

    const fetchComics = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/comics");
            setComics(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

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

    const handleCategoryClick = async (categoryName: string) => {
        try {
            setExpandedCategory(categoryName);
            setIsCategoryLoading(true);

            const res = await axios.get(
                `/api/comics?type=${categoryName.toLowerCase()}`
            );
            const categoryData = res.data.data || res.data || [];
            setCategoryComics(Array.isArray(categoryData) ? categoryData : []);
        } catch (error) {
            console.error("Error fetching category comics:", error);
            setCategoryComics([]);
        } finally {
            setTimeout(() => {
                setIsCategoryLoading(false);
            }, 3000);
        }
    };

    const closeModal = () => {
        setExpandedCategory(null);
        setCategoryComics([]);
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        if (expandedCategory) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [expandedCategory]);

    console.log("comics", comics);

    return (
        <>
            <Navbar onCategoryClick={handleCategoryClick} />
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
                    </div>

                    {/* Genre Terbaru */}
                    <div className="mb-8 w-full lg:w-3/12 bg-neutral-900 p-5 rounded-md">
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
                </section>
            </GuestLayout>

            {/* Modal Overlay for Expanded Category */}
            {expandedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop with blur effect */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-7xl mx-4 max-h-[90vh] bg-slate-900/95 rounded-2xl border border-purple-500/30 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                            <h2 className="text-3xl font-bold text-white">
                                {expandedCategory} Comics
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-300 hover:text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"></div>
                            {categoryComics.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {categoryComics
                                        .filter((comic) => comic && comic.id)
                                        .map((comic) => (
                                            <Fragment key={comic.id}>
                                                <CardComic
                                                    comic={comic}
                                                    isLoading={
                                                        isCategoryLoading
                                                    }
                                                />
                                            </Fragment>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                        No {expandedCategory?.toLowerCase()}{" "}
                                        found
                                    </h3>
                                    <p className="text-gray-400">
                                        Try checking back later for new
                                        additions!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
