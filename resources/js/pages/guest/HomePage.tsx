import GuestLayout from "@/components/layouts/guest/GuestLayout";
import Navbar from "@/components/layouts/guest/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { IComic } from "@/types/index.type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

document.title = "Homepage";

export default function HomePage() {
    const [comics, setComics] = useState<IComic[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const comicTypes = [
        { name: "Manga", count: 150, seed: "manga" },
        { name: "Manhwa", count: 89, seed: "manhwa" },
        { name: "Manhua", count: 67, seed: "manhua" },
    ];

    useEffect(() => {
        setIsLoading(true);
        const load = async () => {
            try {
                const res = await axios.get("/api/comics");
                setComics(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        load();
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, []);

    return (
        <>
            <Navbar />
            {/* Main Content */}
            <GuestLayout>
                {/* Type Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {comicTypes.map((type) => (
                        <div
                            key={type.name}
                            className="group cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">
                                    {type.name}
                                </h2>
                                <span className="text-sm text-gray-400">
                                    {type.count} titles
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-[2/3] rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={`https://picsum.photos/seed/${type.seed}${i}/200/300`}
                                            alt={`${type.name} ${i}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Latest Updates */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Latest Updates
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {comics.length > 0 ? (
                            comics.map((i) => (
                                <div
                                    key={i.id}
                                    className="group cursor-pointer"
                                >
                                    <Link to={`/${i.slug}`}>
                                        <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                            {isLoading ? (
                                                <Skeleton className="w-full h-full" />
                                            ) : (
                                                <img
                                                    src={i.cover_image}
                                                    alt={`Comic ${i.title}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
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
                                            <h3 className="text-sm font-medium text-gray-300 truncate group-hover:text-purple-400 transition-colors">
                                                {i.title}
                                            </h3>
                                            <p className="text-xs text-gray-600">
                                                Chapter
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4">
                                <p className="text-destructive font-bold text-5xl italic">
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
