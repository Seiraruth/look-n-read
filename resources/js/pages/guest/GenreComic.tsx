import CardComic from "@/components/guest-comp/CardComic";
import HeaderPage from "@/components/guest-comp/HeaderPage";
import Footer from "@/components/layouts/guest/Footer";
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
import { Context } from "@/context/Context";
import useFetch from "@/hooks/use-fetch";
import { IComicChapter } from "@/types/index.type";
import axios, { AxiosError } from "axios";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const GenreComic = () => {
    const { slug } = useParams();
    const [comicByGenre, setComicByGenre] = useState<IComicChapter[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectType, setSelectType] = useState<string>("all");

    const { isLoading } = useContext(Context);
    const { getAllComic } = useFetch();

    const typeParams = searchParams.get("type") || "";

    useEffect(() => {
        document.title = "Genre";
    }, []);

    const fetchComicByGenre = useCallback(async () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const data = await getAllComic({ genre: slug, type: typeParams });
        setComicByGenre(data);
    }, [slug, typeParams]);

    useEffect(() => {
        fetchComicByGenre();
    }, [fetchComicByGenre]);

    const handleSelect = () => {
        const params = new URLSearchParams(searchParams);
        if (selectType.toLowerCase() && selectType === "all") {
            params.delete("type");
        } else {
            params.set("type", selectType);
        }

        setSearchParams(params);
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
                    <HeaderPage>
                        Genre :{" "}
                        <span className="font-bold capitalize">
                            {slug?.split("-").join(" ")}
                        </span>
                    </HeaderPage>

                    <div className="my-10 flex gap-5">
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

                        <Button onClick={handleSelect}>Search</Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-20">
                        {comicByGenre.length > 0 &&
                            comicByGenre.map((comic) => (
                                <Fragment key={comic.id}>
                                    <CardComic
                                        comic={comic}
                                        isLoading={isLoading}
                                    />
                                </Fragment>
                            ))}
                    </div>
                </GuestLayout>
            )}
            <Footer />
        </>
    );
};

export default GenreComic;
