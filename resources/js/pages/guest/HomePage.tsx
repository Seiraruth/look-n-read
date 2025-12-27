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
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [categoryComics, setCategoryComics] = useState<IComicChapter[]>([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

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

    const handleCategoryClick = async (categoryName: string) => {
        try {
            setExpandedCategory(categoryName);
            setIsCategoryLoading(true);
            
            const res = await axios.get(`/api/comics?type=${categoryName.toLowerCase()}`);
            const categoryData = res.data.data || res.data || [];
            setCategoryComics(Array.isArray(categoryData) ? categoryData : []);
        } catch (error) {
            console.error("Error fetching category comics:", error);
            setCategoryComics([]);
        } finally {
            setIsCategoryLoading(false);
        }
    };

    const closeModal = () => {
        setExpandedCategory(null);
        setCategoryComics([]);
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (expandedCategory) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [expandedCategory]);

    // console.log(comics);

    return (
        <>
            <Navbar onCategoryClick={handleCategoryClick} />
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
                                <svg className="w-6 h-6 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {isCategoryLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="space-y-3">
                                            <Skeleton className="aspect-[2/3] rounded-lg" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : categoryComics.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {categoryComics.filter(comic => comic && comic.id).map((comic) => (
                                        <div key={comic.id} className="group cursor-pointer">
                                            <Link to={`/${comic.slug}`} onClick={closeModal}>
                                                <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                                    <img
                                                        src={comic.cover_image}
                                                        alt={comic.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            </Link>
                                            <div className="mt-3">
                                                <Link to={`/${comic.slug}`} onClick={closeModal}>
                                                    <h4 className="text-sm font-medium text-gray-300 truncate group-hover:text-purple-400 transition-colors hover:underline">
                                                        {comic.title}
                                                    </h4>
                                                </Link>
                                                {comic.chapters.length > 0 ? (
                                                    <Link 
                                                        to={`/read/${comic.slug}/${comic.chapters.at(-1)?.number}`}
                                                        onClick={closeModal}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="text-xs text-gray-600 w-full mt-2 flex justify-between"
                                                        >
                                                            <span className="truncate">{comic.chapters.at(-1)?.title}</span>
                                                            <span className="text-gray-500 ml-1">
                                                                {formatDistance(
                                                                    new Date(String(comic.chapters.at(-1)?.created_at)),
                                                                    new Date(),
                                                                    {
                                                                        locale: customIdLocale,
                                                                        includeSeconds: true,
                                                                    }
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        disabled
                                                        className="text-xs text-destructive w-full mt-2 flex justify-center cursor-not-allowed"
                                                    >
                                                        No Chapter
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                        No {expandedCategory?.toLowerCase()} found
                                    </h3>
                                    <p className="text-gray-400">
                                        Try checking back later for new additions!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
