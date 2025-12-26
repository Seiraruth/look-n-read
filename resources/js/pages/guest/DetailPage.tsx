import GuestLayout from "@/components/layouts/guest/GuestLayout";
import Navbar from "@/components/layouts/guest/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IChapter, IComic, IGenre } from "@/types/index.type";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface IComicChapter extends IComic {
    chapters: IChapter[];
    genres: IGenre[];
}

const DetailPage = () => {
    const { slug } = useParams();
    const [comic, setComic] = useState<IComicChapter>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Helper function to get proper image URL
    const getImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return undefined;
        // If it already starts with http/https, return as-is
        if (imagePath.startsWith('http')) return imagePath;
        // If it starts with storage/, return as-is 
        if (imagePath.startsWith('storage/')) return `/${imagePath}`;
        // Otherwise, prepend /storage/
        return `/storage/${imagePath}`;
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/comics/${slug}`);
            if (res.data) {
                // Safely handle chapters sorting
                if (res.data.chapters && Array.isArray(res.data.chapters)) {
                    res.data.chapters.sort().reverse();
                }
                setComic(res.data);
            }
        } catch (error) {
            console.error("DetailPage fetch error: ", error);
            // Don't set comic to avoid type issues, let it remain undefined
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [fetchData]);

    console.log(comic);

    return (
        <>
            <Navbar />
            <GuestLayout>
                <section>
                    {/* Start: Comic Image and Detail Comic */}
                    <div className="container w-full flex gap-5 items-center flex-col lg:flex-row">
                        {/* Left: Image */}
                        <div className="w-2/6 lg:w-1/6">
                            <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                {isLoading ? (
                                    <Skeleton className="w-full h-full" />
                                ) : (
                                    <img
                                        src={getImageUrl(comic?.cover_image) || `https://picsum.photos/seed/${comic?.slug}/200/300`}
                                        alt={`Comic ${comic?.title}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://picsum.photos/seed/${comic?.slug}/200/300`;
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        {/* Right: Detail Comic */}
                        <div className="w-full lg:w-5/6">
                            <Table>
                                <TableBody className="text-md">
                                    <TableRow>
                                        <TableCell>Judul Komik</TableCell>
                                        <TableCell>
                                            {isLoading ? (
                                                <Skeleton className="h-4 w-2/4" />
                                            ) : (
                                                comic?.title
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell className="capitalize">
                                            {isLoading ? (
                                                <Skeleton className="h-4 w-2/4" />
                                            ) : (
                                                comic?.type
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Author</TableCell>
                                        <TableCell className="capitalize">
                                            {isLoading ? (
                                                <Skeleton className="h-4 w-2/4" />
                                            ) : (
                                                comic?.author
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Umur Pembaca</TableCell>
                                        <TableCell className="capitalize">
                                            Tahun (minimal)
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Status</TableCell>
                                        <TableCell className="capitalize">
                                            {isLoading ? (
                                                <Skeleton className="h-4 w-2/4" />
                                            ) : (
                                                comic?.status
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Cara Baca</TableCell>
                                        <TableCell>
                                            {comic?.type !== "manga"
                                                ? "Kiri ke kanan"
                                                : "Kanan ke kiri"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Posted On</TableCell>
                                        <TableCell className="capitalize">
                                            {comic?.created_at &&
                                                new Date(
                                                    comic?.created_at
                                                ).toLocaleString("en-EN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Updated On</TableCell>
                                        <TableCell className="capitalize">
                                            {comic?.updated_at &&
                                                new Date(
                                                    comic?.updated_at
                                                ).toLocaleString("en-EN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {/* End: Comic Image and Detail Comic */}

                    {/* Start: Genre  */}
                    <div className="my-10 flex flex-wrap gap-3">
                        {comic?.genres.length ? (
                            <>
                                {comic?.genres.map((genre) => (
                                    <Fragment key={genre.id}>
                                        {isLoading ? (
                                            <Skeleton className="w-28 h-10" />
                                        ) : (
                                            <Badge className="text-md">
                                                {genre.name}
                                            </Badge>
                                        )}
                                    </Fragment>
                                ))}
                            </>
                        ) : (
                            <div className="cols-span-4">
                                <p className="font-bold text-xl text-destructive">
                                    Genres Not Found
                                </p>
                            </div>
                        )}
                    </div>
                    {/* End: Genre */}

                    {/* Start: Synopis */}
                    <div>
                        <h2 className="py-5 font-semibold text-lg">
                            Synopsis: {comic?.title}
                        </h2>
                        <p className="text-justify">{comic?.synopsis}</p>
                    </div>
                    {/* End: Synopsis */}
                </section>

                {/* Start: List Chapter Comic */}
                <section>
                    <div>
                        <h2 className="py-5 font-semibold text-lg">
                            Chapter: {comic?.title}
                        </h2>
                        {/* Start: Chapter Button */}
                        <ScrollArea className="h-72 w-full rounded-md">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                                {comic?.chapters.length ? (
                                    <>
                                        {comic?.chapters.map((chap) => (
                                            <Fragment key={chap.id}>
                                                {isLoading ? (
                                                    <Skeleton className="h-16 w-full" />
                                                ) : (
                                                    <Button
                                                        key={chap.id}
                                                        variant={"outline"}
                                                        className="hover:bg-primary hover:text-background h-auto flex justify-start"
                                                    >
                                                        <Link
                                                            to={`/read/${comic.slug}/${chap.number}`}
                                                        >
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-lg font-semibold">
                                                                    {chap.title}
                                                                </span>
                                                                <span className="text-sm font-light">
                                                                    {chap.created_at &&
                                                                        new Date(
                                                                            chap.created_at
                                                                        ).toLocaleString(
                                                                            "en-EN",
                                                                            {
                                                                                day: "numeric",
                                                                                month: "numeric",
                                                                                year: "numeric",
                                                                                hour: "numeric",
                                                                                minute: "numeric",
                                                                            }
                                                                        )}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </Button>
                                                )}
                                            </Fragment>
                                        ))}
                                    </>
                                ) : (
                                    <Button
                                        variant={"outline"}
                                        className="hover:bg-primary hover:text-background h-auto text-destructive italic col-span-5"
                                    >
                                        No Chapter 😑
                                    </Button>
                                )}
                            </div>
                        </ScrollArea>
                        {/* End: Chapter Button */}
                    </div>
                </section>
                {/* End: List Chapter Comic */}
            </GuestLayout>
        </>
    );
};

export default DetailPage;
