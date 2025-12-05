"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
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

const usersData = [
    {
        id: "1",
        avatar: "ok",
        name: "ok",
        email: "ok",
        role: "ok",
        lastLogin: "ok",
        twoStep: "ok",
        joinedDate: "ok",
    },
];

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(usersData.length / itemsPerPage);

    const currentUsers = usersData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleAllUsers = () => {
        if (
            selectedUsers.length === currentUsers.length &&
            currentUsers.length > 0
        ) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentUsers.map((user) => user.id));
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6 my-8 mx-auto max-w-full">
                {/* Main Card */}
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
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add User
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
                                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                                            <Checkbox
                                                checked={
                                                    selectedUsers.length ===
                                                        currentUsers.length &&
                                                    currentUsers.length > 0
                                                }
                                                onCheckedChange={toggleAllUsers}
                                            />
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm text-nowrap text-muted-foreground uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm text-nowrap text-muted-foreground uppercase tracking-wider">
                                            Two-Step
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm text-nowrap text-muted-foreground uppercase tracking-wider">
                                            Joined Date
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm text-muted-foreground uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-border hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={selectedUsers.includes(
                                                        user.id
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleUserSelection(
                                                            user.id
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 bg-muted">
                                                        <AvatarImage
                                                            src={user.avatar}
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                            {getInitials(
                                                                user.name
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-foreground">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm text-muted-foreground">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm font-medium text-foreground text-nowrap">
                                                    {user.lastLogin}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {user.twoStep ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                                    >
                                                        Enabled
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm text-muted-foreground text-nowrap">
                                                    {user.joinedDate}
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
                                                        <DropdownMenuItem className="text-destructive cursor-pointer">
                                                            Delete
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
                                Showing {(currentPage - 1) * itemsPerPage + 1}{" "}
                                to{" "}
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    usersData.length
                                )}{" "}
                                of {usersData.length} entries
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
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
