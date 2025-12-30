import CardComic from "@/components/guest-comp/CardComic";
import HeaderPage from "@/components/guest-comp/HeaderPage";
import NoComic from "@/components/guest-comp/NoComic";
import Footer from "@/components/layouts/guest/Footer";
import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { Navbar } from "@/components/layouts/guest/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IGenre } from "@/types/index.type";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ListComic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [comics, setComics] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectType, setSelectType] = useState<string>("all");
    const [selectStatus, setSelectStatus] = useState<string>("all");
    const [selectGenre, setSelectGenre] = useState<string>("all");
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const currentPage = Number(searchParams.get("page")) || 1;

    const ITEM_PER_PAGE = 24;
    const TOTAL_PAGE = Math.ceil(comics?.length / ITEM_PER_PAGE);
    const currentComics = comics?.slice(
        (currentPage - 1) * ITEM_PER_PAGE,
        currentPage * ITEM_PER_PAGE
    );

    const typeParams = searchParams.get("type") || "";
    const statusParams = searchParams.get("status") || "";
    const genreParams = searchParams.get("genre") || "";

    useEffect(() => {
        document.title = "List Comic";
    }, []);

    const fetchComic = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: {
                type?: string;
                status?: string;
                genre?: string;
            } = {};
            if (genreParams) params.genre = genreParams;
            if (typeParams) params.type = typeParams;
            if (statusParams) params.status = statusParams;

            const res = await axios.get("/api/comics", {
                params: params,
            });
            setComics(res.data.data);
        } catch (error) {
            console.error("fetch list comic", error);
        } finally {
            setIsLoading(false);
        }
    }, [statusParams, typeParams, genreParams]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        fetchComic();
    }, [currentPage, fetchComic]);

    useEffect(() => {
        if (!searchParams.has("page")) {
            const params = new URLSearchParams(searchParams);
            params.set("page", "1");
            setSearchParams(params, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handlePage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        setSearchParams(params);

        // Scroll ke atas biar enak UX-nya
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    const handleSelect = () => {
        const params = new URLSearchParams(searchParams);

        if (selectGenre && selectGenre !== "all") {
            params.set("genre", selectGenre);
        } else {
            params.delete("genre");
        }

        if (selectStatus && selectStatus !== "all") {
            params.set("status", selectStatus);
        } else {
            params.delete("status");
        }

        if (selectType && selectType !== "all") {
            params.set("type", selectType);
        } else {
            params.delete("type");
        }
        params.delete("page");
        setSearchParams(params);
    };

    const handleReset = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("type");
        params.delete("genre");
        params.delete("status");
        setSearchParams(params);
        setSelectGenre("all");
        setSelectType("all");
        setSelectStatus("all");
    };

    const generatePagination = (currentPage: number, totalPage: number) => {
        if (totalPage <= 7) {
            return Array.from({ length: totalPage }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPage];
        }

        if (currentPage >= totalPage - 3) {
            return [
                1,
                "...",
                totalPage - 5,
                totalPage - 4,
                totalPage - 3,
                totalPage - 2,
                totalPage - 1,
                totalPage,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPage,
        ];
    };

    return (
        <>
            <Navbar />

            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <img src="/assets/gifs/zoro-loading.gif" alt="" />
                </div>
            ) : (
                <GuestLayout>
                    <HeaderPage>List Comic</HeaderPage>

                    {/* Filteres */}
                    <div className="my-10 flex gap-5">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild className="w-1/4">
                                <Button
                                    variant="outline"
                                    className="flex justify-start capitalize"
                                >
                                    {selectGenre !== "all"
                                        ? `Genre: ${selectGenre
                                              .split("-")
                                              .join(" ")}`
                                        : "Genre"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[320px] sm:w-[420px] my-20">
                                <ScrollArea className="h-72 w-full rounded-md border">
                                    <RadioGroup
                                        defaultValue="comfortable"
                                        className="grid grid-cols-2"
                                        onValueChange={(value) =>
                                            setSelectGenre(value)
                                        }
                                        value={selectGenre}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem
                                                value="all"
                                                id="all"
                                            />
                                            <Label htmlFor="all">Genre</Label>
                                        </div>
                                        {genres.length > 0 &&
                                            genres.map((genre) => (
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem
                                                        value={genre.slug}
                                                        id={genre.slug}
                                                    />
                                                    <Label htmlFor={genre.slug}>
                                                        {genre.name}
                                                    </Label>
                                                </div>
                                            ))}
                                    </RadioGroup>
                                </ScrollArea>
                                <Button onClick={() => setIsOpen(false)}>
                                    Select
                                </Button>
                            </DialogContent>
                        </Dialog>

                        <Select
                            value={selectStatus}
                            onValueChange={(value) => setSelectStatus(value)}
                            defaultValue="all"
                        >
                            <SelectTrigger className="w-1/4">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status Comic</SelectLabel>
                                    <SelectItem value="all">Status</SelectItem>
                                    <SelectItem value="ongoing">
                                        Ongoing
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectType}
                            onValueChange={(value) => setSelectType(value)}
                            defaultValue="all"
                        >
                            <SelectTrigger className="w-1/4">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Type Comic</SelectLabel>
                                    <SelectItem value="all">Type</SelectItem>
                                    <SelectItem value="manga">Manga</SelectItem>
                                    <SelectItem value="manhua">
                                        Manhua
                                    </SelectItem>
                                    <SelectItem value="manhwa">
                                        Manhwa
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div className="w-1/4 flex gap-5">
                            <Button className="w-full" onClick={handleSelect}>
                                Search
                            </Button>
                            <Button
                                className="w-full"
                                variant={"destructive"}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* List Comic */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 my-10 bg-neutral-900 p-10 rounded-md">
                        {currentComics.length > 0 ? (
                            <>
                                {currentComics.map((comic) => (
                                    <Fragment>
                                        <CardComic
                                            comic={comic}
                                            isLoading={isLoading}
                                        />
                                    </Fragment>
                                ))}
                            </>
                        ) : (
                            <div className="flex justify-center items-center col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6">
                                <p className="text-destructive font-bold text-xl sm:text-2xl mdtext-3xl">
                                    No Comic Found
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * ITEM_PER_PAGE + 1} to{" "}
                            {Math.min(
                                currentPage * ITEM_PER_PAGE,
                                comics?.length
                            )}{" "}
                            of {comics?.length} entries
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                disabled={currentPage === 1}
                                onClick={() => {
                                    handlePage(Math.max(1, currentPage - 1));
                                }}
                            >
                                <ChevronLeft />
                            </Button>
                            {generatePagination(currentPage, TOTAL_PAGE).map(
                                (page, index) => {
                                    if (page === "...") {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="px-2 text-muted-foreground"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            onClick={() =>
                                                handlePage(Number(page))
                                            }
                                            size={"icon"}
                                            variant={
                                                currentPage === page
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {page}
                                        </Button>
                                    );
                                }
                            )}
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                disabled={currentPage >= TOTAL_PAGE}
                                onClick={() => {
                                    handlePage(
                                        Math.min(TOTAL_PAGE, currentPage + 1)
                                    );
                                }}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </GuestLayout>
            )}

            <Footer />
        </>
    );
};

export default ListComic;
