import CardComic from "@/components/guest-comp/CardComic";
import HeaderPage from "@/components/guest-comp/HeaderPage";
import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { Navbar } from "@/components/layouts/guest/Navbar";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ListComic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [comics, setComics] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectType, setSelectType] = useState<string>("all");
    const [selectStatus, setSelectStatus] = useState<string>("all");

    const typeParams = searchParams.get("type") || "";
    const statusParams = searchParams.get("stauts") || "";

    const fetchComic = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: { type?: string; status?: string } = {};

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
    }, [statusParams, typeParams]);

    useEffect(() => {
        fetchComic();
    }, [fetchComic]);

    const handleSelect = () => {
        const newParams: { type?: string; status?: string } = {};
        if (selectType && selectType.toLowerCase() !== "all") {
            newParams.type = selectType;
        }

        if (selectStatus && selectStatus.toLowerCase() !== "all") {
            newParams.status = selectStatus;
        }

        setSearchParams(newParams);
    };

    return (
        <>
            <Navbar />
            <GuestLayout>
                <HeaderPage>List Comic</HeaderPage>

                {/* Filteres */}
                <div className="my-10 flex gap-5">
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
                                <SelectItem value="ongoing">Ongoing</SelectItem>
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
                                <SelectItem value="manhua">Manhua</SelectItem>
                                <SelectItem value="manhwa">Manhwa</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button onClick={handleSelect}>Search</Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-10 bg-neutral-900 p-5">
                    {comics.length > 0 &&
                        comics.map((comic) => (
                            <Fragment>
                                <CardComic
                                    comic={comic}
                                    isLoading={isLoading}
                                />
                            </Fragment>
                        ))}
                </div>
            </GuestLayout>
        </>
    );
};

export default ListComic;
