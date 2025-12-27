import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IChapter, IComic, IGenre } from "@/types/index.type";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale/id";
import { Navbar } from "@/components/layouts/guest/Navbar";
import { customIdLocale } from "@/lib/utils";

document.title = "Homepage";

interface IComicChapter extends IComic {
    chapters: IChapter[];
    genres: IGenre[];
}

export default function HomePage() {
    const [comics, setComics] = useState<IComicChapter[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchComics = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/comics");
            setComics(res.data.data);
        } catch (error) {
            console.error(error);
        }
    }, [setComics]);

    useEffect(() => {
        fetchComics();
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [fetchComics]);

    // console.log(comics);

    return (
        <>
            <Navbar />
            {/* Main Content */}
            <GuestLayout>
                {/* Latest Updates */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Latest Updates
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {comics.length > 0 ? (
                            comics
                                .filter((comic) => comic && comic.id)
                                .map((i) => (
                                    <div
                                        key={i.id}
                                        className="group cursor-pointer"
                                    >
                                        <Link to={`/${i.slug}`}>
                                            <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all relative">
                                                {isLoading ? (
                                                    <Skeleton className="w-full h-full" />
                                                ) : (
                                                    <>
                                                        <img
                                                            src={i.cover_image}
                                                            alt={`Comic ${i.title}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <img
                                                            src={`/assets/flags/${
                                                                i.type.toLowerCase() ===
                                                                "manga"
                                                                    ? "jp-original.webp"
                                                                    : i.type.toLowerCase() ===
                                                                      "manhua"
                                                                    ? "cn-original.webp"
                                                                    : "kr-original.webp"
                                                            }`}
                                                            alt={i.type}
                                                            className="absolute top-1 right-1 w-8 rounded-sm"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                        {isLoading ? (
                                            <div className="mt-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-1/4 mt-1" />
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                                <Link to={`/${i.slug}`}>
                                                    <h3 className="text-sm font-medium text-gray-300 truncate hover:text-purple-400 transition-colors hover:underline">
                                                        {i.title}
                                                    </h3>
                                                </Link>
                                                {i.chapters.length > 0 ? (
                                                    <Link
                                                        to={`/read/${i.slug}/${
                                                            i.chapters.at(-1)
                                                                ?.number
                                                        }`}
                                                    >
                                                        <Button
                                                            variant={"outline"}
                                                            className="text-xs text-gray-600 w-full mt-3 flex justify-between"
                                                        >
                                                            <span>
                                                                {
                                                                    i.chapters.at(
                                                                        -1
                                                                    )?.title
                                                                }
                                                            </span>
                                                            <span>
                                                                {formatDistance(
                                                                    new Date(
                                                                        String(
                                                                            i.chapters.at(
                                                                                -1
                                                                            )
                                                                                ?.created_at
                                                                        )
                                                                    ),
                                                                    new Date(),
                                                                    {
                                                                        locale: customIdLocale,
                                                                        includeSeconds:
                                                                            true,
                                                                    }
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        variant={"outline"}
                                                        disabled
                                                        className="text-xs text-destructive w-full mt-3 flex justify-center cursor-not-allowed"
                                                    >
                                                        No Chapter
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
            </GuestLayout>
        </>
    );
}
