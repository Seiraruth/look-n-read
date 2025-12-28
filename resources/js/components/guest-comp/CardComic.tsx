import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { formatDistance } from "date-fns";
import { customIdLocale } from "@/lib/utils";
import { IComicChapter } from "@/types/index.type";

interface IProps {
    comic: IComicChapter;
    isLoading: boolean;
}

const CardComic = ({ comic, isLoading }: IProps) => {
    return (
        <div className="group cursor-pointer">
            <Link to={`/${comic.slug}`}>
                <div className="aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all relative">
                    {isLoading ? (
                        <Skeleton className="w-full h-full" />
                    ) : (
                        <>
                            <img
                                src={comic.image_url}
                                alt={`Comic ${comic.title}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <img
                                src={`/assets/flags/${
                                    comic.type.toLowerCase() === "manga"
                                        ? "jp-original.webp"
                                        : comic.type.toLowerCase() === "manhua"
                                        ? "cn-original.webp"
                                        : "kr-original.webp"
                                }`}
                                alt={comic.type}
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
                    <Link to={`/${comic.slug}`}>
                        <h3 className="text-sm font-medium text-gray-300 truncate hover:text-purple-400 transition-colors hover:underline">
                            {comic.title}
                        </h3>
                    </Link>
                    {comic.chapters.length > 0 ? (
                        <Link
                            to={`/read/${comic.slug}/${
                                comic.chapters.at(-1)?.number
                            }`}
                        >
                            <Button
                                variant={"outline"}
                                className="text-[10px] sm:text-xs text-neutral-50 w-full mt-3 flex justify-between flex-wrap hover:text-purple-400"
                            >
                                <span>{comic.chapters.at(-1)?.title}</span>
                                <span>
                                    {formatDistance(
                                        new Date(
                                            String(
                                                comic.chapters.at(-1)
                                                    ?.created_at
                                            )
                                        ),
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
    );
};

export default CardComic;
