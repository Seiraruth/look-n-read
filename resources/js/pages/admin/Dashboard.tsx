import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ComicsType } from "@/types/index.type";
import { toast } from "sonner";

const Dashboard = () => {
    const [comics, setComics] = useState<ComicsType[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchRef = useRef(null);

    const currentPage = Number(searchParams.get("page")) || 1;

    const currentQuery = searchParams.get("search") || "";

    const itemsPerPage = 10;
    const totalPages = Math.ceil(comics?.length / itemsPerPage);
    const currentComics = comics?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (!searchParams.has("page")) {
            const params = new URLSearchParams(searchParams);
            params.set("page", "1");
            console.log(params);
            setSearchParams(params, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleChangePage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        setSearchParams(params);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        document.title = "Dashboard - admin";
    }, []);

    const handleDeleteComic = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/auth/admin/comics/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setComics((prevComics) =>
                prevComics.filter((comic) => comic.id !== id)
            );
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus komik");
        }
    };

    const fetchComic = useCallback(async () => {
        setIsLoading(true);
        try {
            if (currentQuery) {
                const response = await axios.get(
                    `/api/comics?search=${currentQuery}`
                );
                setComics(response.data.data);
            } else {
                const response = await axios.get("/api/comics");
                setComics(response?.data.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [currentQuery]);

    useEffect(() => {
        fetchComic();
    }, [fetchComic]);

    const handleSearch = (queryRef: any) => {
        const params = new URLSearchParams(searchParams);

        if (!queryRef && queryRef.trim() === "") {
            params.delete("search");
        } else {
            params.set("search", queryRef);
        }
        params.delete("page");
        setSearchParams(params);
    };

    const handleSearchEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch(
                (searchRef.current as unknown as HTMLInputElement)
                    ?.value as string
            );
        }
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
        <AdminLayout>
            <div className="w-full space-y-6 my-8 mx-auto max-w-full">
                {/* Main Card */}
                <Card className="pb-0 gap-0 mx-6 md:mx-8">
                    <CardHeader className="border-b border-border gap-0">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex max-w-lg gap-5  w-full">
                                <div className="w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        ref={searchRef}
                                        type="search"
                                        placeholder="Search comic"
                                        className="pl-10"
                                        onKeyDown={handleSearchEnter}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        handleSearch(
                                            (
                                                searchRef.current as unknown as HTMLInputElement
                                            )?.value as string
                                        )
                                    }
                                >
                                    Search
                                </Button>
                            </div>
                            <div className="sm:ml-auto flex items-center gap-2 flex-wrap justify-center">
                                <Button
                                    size="sm"
                                    className="bg-primary cursor-pointer"
                                >
                                    <Link
                                        to={"/admin/add"}
                                        className="flex gap-2"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add comic
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Table */}
                        {isLoading ? (
                            <div className="flex justify-center items-center min-h-screen">
                                <img
                                    src="/assets/gifs/zoro-loading.gif"
                                    alt=""
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50">
                                            <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                                Cover
                                            </th>
                                            <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentComics?.length ? (
                                            <>
                                                {currentComics.map((comic) => (
                                                    <tr
                                                        key={comic.id}
                                                        className="border-b border-border hover:bg-muted/30 transition-colors"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3 w-fit">
                                                                <Avatar className="h-20 w-20 bg-muted relative">
                                                                    <AvatarImage
                                                                        src={
                                                                            comic.image_url
                                                                        }
                                                                        alt={
                                                                            comic.title
                                                                        }
                                                                        className="absolute top-0 left-0 object-cover"
                                                                    />
                                                                </Avatar>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm text-muted-foreground line-clamp-1">
                                                                {comic.title
                                                                    .length > 40
                                                                    ? `${comic.title.substring(
                                                                          0,
                                                                          40
                                                                      )}...`
                                                                    : comic.title}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm font-medium text-foreground text-nowrap capitalize">
                                                                {comic.type}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {comic.status ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800 capitalize"
                                                                >
                                                                    {
                                                                        comic.status
                                                                    }
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">
                                                                    -
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-sm text-muted-foreground text-nowrap">
                                                                {new Date(
                                                                    comic.created_at
                                                                ).toLocaleDateString(
                                                                    "en-EN",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "2-digit",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Actions
                                                                        <ChevronDown className="ml-1 h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem className="cursor-pointer">
                                                                        <Button className="w-full">
                                                                            <Link
                                                                                to={`/admin/edit/${comic.slug}`}
                                                                            >
                                                                                Edit
                                                                            </Link>
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="cursor-pointer">
                                                                        <Button
                                                                            className="w-full"
                                                                            variant={
                                                                                "outline"
                                                                            }
                                                                        >
                                                                            <Link
                                                                                to={`/admin/comics/${comic.slug}`}
                                                                            >
                                                                                Chapters
                                                                            </Link>
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="cursor-pointer">
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleDeleteComic(
                                                                                    comic.id
                                                                                )
                                                                            }
                                                                            className="bg-destructive hover:bg-destructive/80 w-full"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr className="text-destructive text-center h-28">
                                                <td
                                                    colSpan={6}
                                                    className="text-2xl italic font-bold"
                                                >
                                                    comic not found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && (
                            <>
                                {currentComics?.length > 0 && (
                                    <div className="flex items-center justify-between p-4 border-t border-border">
                                        <div className="text-sm text-muted-foreground">
                                            Showing{" "}
                                            {(currentPage - 1) * itemsPerPage +
                                                1}{" "}
                                            to{" "}
                                            {Math.min(
                                                currentPage * itemsPerPage,
                                                comics.length
                                            )}{" "}
                                            of {comics.length} entries
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleChangePage(
                                                        Math.max(
                                                            1,
                                                            currentPage - 1
                                                        )
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="cursor-pointer"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            {generatePagination(
                                                currentPage,
                                                totalPages
                                            ).map((page, index) => {
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
                                                        key={page}
                                                        variant={
                                                            currentPage === page
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size={"icon"}
                                                        onClick={() =>
                                                            handleChangePage(
                                                                Number(page)
                                                            )
                                                        }
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            })}
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleChangePage(
                                                        Math.min(
                                                            totalPages,
                                                            currentPage + 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="cursor-pointer"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
