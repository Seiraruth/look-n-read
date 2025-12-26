import GuestLayout from "@/components/layouts/guest/GuestLayout";
import Navbar from "@/components/layouts/guest/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IChapter, IComic, IGenre } from "@/types/index.type";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale/id";

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
    const [categoryCounts, setCategoryCounts] = useState<{[key: string]: number}>({
        manga: 0,
        manhwa: 0,
        manhua: 0
    });
    const [isCountsLoading, setIsCountsLoading] = useState<boolean>(true);

    const comicTypes = [
        { name: "Manga", count: categoryCounts.manga, seed: "manga" },
        { name: "Manhwa", count: categoryCounts.manhwa, seed: "manhwa" },
        { name: "Manhua", count: categoryCounts.manhua, seed: "manhua" },
    ];

    // Helper function to get proper image URL
    const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
        if (!imagePath) return undefined;
        // If it already starts with http/https, return as-is
        if (imagePath.startsWith('http')) return imagePath;
        // If it starts with storage/, return as-is 
        if (imagePath.startsWith('storage/')) return `/${imagePath}`;
        // Otherwise, prepend /storage/
        return `/storage/${imagePath}`;
    };

    // Helper function to get preview comics for a category
    const getCategoryPreviewComics = (categoryName: string) => {
        const categoryKey = categoryName.toLowerCase();
        return comics.filter(comic => 
            comic.type?.toLowerCase() === categoryKey
        ).slice(0, 4);
    };

    // Helper function to safely format dates
    const safeFormatDistance = (dateValue: string | Date | undefined | null) => {
        try {
            if (!dateValue) return 'Unknown';
            const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
            if (isNaN(date.getTime())) return 'Invalid date';
            return formatDistance(date, new Date(), { addSuffix: true, locale: id });
        } catch (error) {
            console.warn('Date formatting error:', error);
            return 'Unknown';
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setIsCountsLoading(true);
            
            try {
                // Load comics and category counts in parallel
                const [comicsRes, countsRes] = await Promise.all([
                    axios.get("/api/comics").catch(() => ({ data: { data: [] } })),
                    axios.get("/api/comics/stats").catch(() => ({ data: { data: { manga: 0, manhwa: 0, manhua: 0 } } }))
                ]);
                
                // Safely handle comics data
                const comicsData = comicsRes.data.data || comicsRes.data || [];
                setComics(Array.isArray(comicsData) ? comicsData : []);
                
                // Update category counts from API response
                if (countsRes.data?.data) {
                    setCategoryCounts({
                        manga: countsRes.data.data.manga || 0,
                        manhwa: countsRes.data.data.manhwa || 0,
                        manhua: countsRes.data.data.manhua || 0
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
                // Fallback: try to load just comics
                try {
                    const comicsRes = await axios.get("/api/comics");
                    const comicsData = comicsRes.data.data || comicsRes.data || [];
                    const safeComicsData = Array.isArray(comicsData) ? comicsData : [];
                    setComics(safeComicsData);
                    
                    // Count categories from the comics data as fallback
                    const counts = safeComicsData.reduce((acc: {[key: string]: number}, comic: IComicChapter) => {
                        const type = comic?.type?.toLowerCase() || 'manga';
                        acc[type] = (acc[type] || 0) + 1;
                        return acc;
                    }, {});
                    
                    setCategoryCounts({
                        manga: counts.manga || 0,
                        manhwa: counts.manhwa || 0,
                        manhua: counts.manhua || 0
                    });
                } catch (fallbackError) {
                    console.error("Fallback error:", fallbackError);
                    // Set empty state if everything fails
                    setComics([]);
                    setCategoryCounts({
                        manga: 0,
                        manhwa: 0,
                        manhua: 0
                    });
                }
            } finally {
                setIsCountsLoading(false);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
            }
        };
        
        loadData();
    }, []);

    const handleCategoryClick = async (categoryName: string) => {
        try {
            // Open modal and load comics for this category
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
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
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
            <Navbar />
            {/* Main Content */}
            <GuestLayout>
                {/* Type Categories */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {comicTypes.map((type) => (
                            <div
                                key={type.name}
                                onClick={() => handleCategoryClick(type.name)}
                                className="group cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-white">
                                        {type.name}
                                    </h2>
                                    <div className="text-sm text-gray-400">
                                        {isCountsLoading ? (
                                            <Skeleton className="h-4 w-16" />
                                        ) : (
                                            <span>{type.count} titles</span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 1, 2, 3].map((i) => {
                                        const previewComics = getCategoryPreviewComics(type.name);
                                        const comic = previewComics[i];
                                        
                                        return (
                                            <div
                                                key={i}
                                                className="aspect-[2/3] rounded-lg overflow-hidden bg-slate-800"
                                            >
                                                {isLoading ? (
                                                    <Skeleton className="w-full h-full" />
                                                ) : comic ? (
                                                    <img
                                                        src={getImageUrl(comic.cover_image)}
                                                        alt={comic.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            // Fallback to placeholder if image fails to load
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = `https://picsum.photos/seed/${type.seed}${i}/200/300`;
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={`https://picsum.photos/seed/${type.seed}${i}/200/300`}
                                                        alt={`${type.name} placeholder ${i + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Latest Updates */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Latest Updates
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {comics.length > 0 ? (
                            comics.filter(comic => comic && comic.id).map((i) => (
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
                                                    src={getImageUrl(i.cover_image)}
                                                    alt={`Comic ${i.title}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `https://picsum.photos/seed/${i.slug}/200/300`;
                                                    }}
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
                                            <Link
                                                to={`/read/${i.slug}/${i.chapters.at(-1)?.number
                                                    }`}
                                            >
                                                <Button
                                                    variant={"outline"}
                                                    className="text-xs text-gray-600 w-full mt-3 flex justify-between"
                                                >
                                                    <span>
                                                        {
                                                            i.chapters.at(-1)
                                                                ?.title
                                                        }
                                                    </span>
                                                    <span>
                                                        {safeFormatDistance(
                                                            i.chapters.at(-1)?.created_at
                                                        )}
                                                    </span>
                                                </Button>
                                            </Link>
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
                                                        src={getImageUrl(comic.cover_image)}
                                                        alt={comic.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = `https://picsum.photos/seed/${comic.slug}/200/300`;
                                                        }}
                                                    />
                                                </div>
                                            </Link>
                                            <div className="mt-3">
                                                <h4 className="text-sm font-medium text-gray-300 truncate group-hover:text-purple-400 transition-colors">
                                                    {comic.title}
                                                </h4>
                                                {comic.chapters.length > 0 && (
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
                                                                {safeFormatDistance(
                                                                    comic.chapters.at(-1)?.created_at
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </Link>
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
