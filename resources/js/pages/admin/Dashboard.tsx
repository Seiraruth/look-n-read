import React, { useCallback, useEffect, useState } from "react";
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
    Filter,
    Download,
    Plus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { authService } from "@/services/authService";
import { ComicsType } from "@/types/index.type";

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [comics, setComics] = useState<ComicsType[]>([]);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(comics.length / itemsPerPage);
    const currentComics = comics.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDeleteComic = async (id: number) => {
        console.log(id);
        try {
            await axios.delete(`/api/auth/admin/comics/${id}`);
            setComics((prevComics) =>
                prevComics.filter((comic) => comic.id !== id)
            );
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get("/api/auth/admin/comics");
            setComics(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }, [setComics]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    console.log(comics);
    return (
        <AdminLayout>
            <div className="w-full space-y-6 my-8 mx-auto max-w-full">
                {/* Main Card */}
                {comics.length > 0 ? (
                    <Card className="pb-0 gap-0 mx-6 md:mx-8">
                        <CardHeader className="border-b border-border gap-0">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search user"
                                        className="pl-10"
                                    />
                                </div>
                                <div className="sm:ml-auto flex items-center gap-2 flex-wrap justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                                <ChevronDown className="h-4 w-4 ml-2" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="cursor-pointer">
                                                Export as CSV
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                Export as Excel
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                Export as PDF
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                        size="sm"
                                        className="bg-primary cursor-pointer"
                                    >
                                        <Link
                                            to={"/admin/add"}
                                            className="flex gap-2"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add User
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Table */}
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
                                        {comics.length > 0 &&
                                            currentComics.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-border hover:bg-muted/30 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3 w-fit">
                                                            <Avatar className="h-20 w-20 bg-muted relative">
                                                                <AvatarImage
                                                                    src={
                                                                        user.image_url
                                                                    }
                                                                    alt={
                                                                        user.title
                                                                    }
                                                                    className="absolute top-0 left-0 object-cover"
                                                                />
                                                            </Avatar>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-sm text-muted-foreground">
                                                            {user.title}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-sm font-medium text-foreground text-nowrap">
                                                            {user.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {user.status ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                                            >
                                                                {user.status}
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
                                                                user.created_at
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
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="cursor-pointer">
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleDeleteComic(
                                                                                user.id
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
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-4 border-t border-border">
                                <div className="text-sm text-muted-foreground">
                                    Showing{" "}
                                    {(currentPage - 1) * itemsPerPage + 1} to{" "}
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
                                            setCurrentPage(
                                                Math.max(1, currentPage - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="cursor-pointer"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <Button
                                            key={page}
                                            variant={
                                                currentPage === page
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="icon"
                                            onClick={() => setCurrentPage(page)}
                                            className={cn(
                                                currentPage === page &&
                                                    "bg-primary",
                                                "cursor-pointer"
                                            )}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages,
                                                    currentPage + 1
                                                )
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="cursor-pointer"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-4xl font-bold text-center border min-h-screen">
                        <div>NOT FOUND COMICS</div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
