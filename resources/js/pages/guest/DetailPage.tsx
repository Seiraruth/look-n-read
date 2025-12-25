import GuestLayout from "@/components/layouts/guest/GuestLayout";
import Navbar from "@/components/layouts/guest/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IChapter, IComic } from "@/types/index.type";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IComicChapter extends IComic {
    chapters: IChapter[];
}

const DetailPage = () => {
    const { slug } = useParams();
    const [comic, setComic] = useState<IComicChapter>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/comics/${slug}`);
            res.data.chapters.sort().reverse();
            setComic(res.data);
        } catch (error) {
            console.error("Chapter.tsx error: ", error);
        }
    }, [slug]);

    useEffect(() => {
        fetchData();
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [fetchData]);

    return (
        <>
            <Navbar />
            <GuestLayout>
                <section>
                    {/* Start: Comic Image and Detail Comic */}
                    <div className="container w-full flex gap-5 items-center">
                        {/* Left: Image */}
                        <div className="w-1/6">
                            <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                {isLoading ? (
                                    <Skeleton className="w-full h-full" />
                                ) : (
                                    <img
                                        src={comic?.cover_image}
                                        alt={`Comic ${comic?.title}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                            </div>
                        </div>
                        {/* Right: Detail Comic */}
                        <div className="w-5/6">
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
                    <div className="my-10 flex gap-3">
                        <Badge className="text-md">Action</Badge>
                        <Badge className="text-md">Advanture</Badge>
                        <Badge className="text-md">Comedy</Badge>
                    </div>
                    {/* End: Genre */}

                    {/* Start: Synopis */}
                    <div>
                        <h2 className="py-5 font-semibold text-lg">
                            Synopsis: {comic?.title}
                        </h2>
                        <p>{comic?.synopsis}</p>
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
                        <div className="grid grid-cols-4 gap-5">
                            {comic?.chapters.length ? (
                                <>
                                    {comic?.chapters.map((chap) => (
                                        <Button
                                            key={chap.id}
                                            variant={"outline"}
                                            className="hover:bg-primary hover:text-background h-auto flex justify-start"
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
                                        </Button>
                                    ))}
                                </>
                            ) : (
                                <Button
                                    variant={"outline"}
                                    className="hover:bg-primary hover:text-background h-auto"
                                >
                                    No Chapter -_-
                                </Button>
                            )}
                        </div>
                        {/* End: Chapter Button */}
                    </div>
                </section>
                {/* End: List Chapter Comic */}
            </GuestLayout>
        </>
    );
};

export default DetailPage;
