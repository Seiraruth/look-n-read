import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { IChapter } from "@/types/index.type"; // Pastikan import IChapter benar
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Tipe data untuk Detail Chapter yang sedang dibaca
type TChapterImage = {
    id: number;
    image_path: string;
    page_number: number;
    url: string;
};

type TChapterDetail = {
    id: number;
    title: string;
    number: string; // String karena bisa "10.5"
    comic_id: number;
    images: TChapterImage[];
};

const ReadChapter = () => {
    const { slug, chapterNumber } = useParams();
    // State untuk chapter yang SEDANG DIBACA
    const [currentChapter, setCurrentChapter] = useState<TChapterDetail | null>(
        null
    );
    // State untuk DAFTAR SEMUA CHAPTER (untuk navigasi)
    const [chapterList, setChapterList] = useState<IChapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [comicName, setComicName] = useState<string>("");

    // 1. Load Data Chapter yang sedang dibuka (Images)
    useEffect(() => {
        const loadChapterData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `/api/read/${slug}/${chapterNumber}`
                );
                setCurrentChapter(res?.data.data);
            } catch (error) {
                console.error("Gagal load chapter:", error);
            } finally {
                setLoading(false);
            }
        };
        loadChapterData();
    }, [slug, chapterNumber]);

    // 2. Load Daftar Semua Chapter (untuk logika Next/Prev)
    const fetchChapterList = useCallback(async () => {
        try {
            const res = await axios.get(`/api/comics/${slug}`);
            // Asumsi response-nya: res.data.chapters adalah array of chapters
            // Kita urutkan dulu biar aman (Ascending: 1, 2, 3...)
            const sortedChapters = res?.data.chapters.sort(
                (a: IChapter, b: IChapter) => {
                    return parseFloat(a.number) - parseFloat(b.number);
                }
            );
            setComicName(res?.data.title);
            setChapterList(sortedChapters);
        } catch (error) {
            console.error(error);
        }
    }, [slug]);

    useEffect(() => {
        fetchChapterList();
    }, [fetchChapterList]);

    // 3. LOGIKA NEXT & PREV (Menggunakan useMemo biar efisien)
    const { prevChapter, nextChapter } = useMemo(() => {
        if (!chapterList.length || !chapterNumber)
            return { prevChapter: null, nextChapter: null };

        // Cari index chapter saat ini di dalam list
        const currentIndex = chapterList.findIndex(
            (c) => String(c.number) === String(chapterNumber)
        );

        // Jika tidak ketemu (-1), return null
        if (currentIndex === -1)
            return { prevChapter: null, nextChapter: null };

        // Prev adalah index - 1 (jika index > 0)
        const prev = currentIndex > 0 ? chapterList[currentIndex - 1] : null;

        // Next adalah index + 1 (jika index < panjang array - 1)
        const next =
            currentIndex < chapterList.length - 1
                ? chapterList[currentIndex + 1]
                : null;

        return { prevChapter: prev, nextChapter: next };
    }, [chapterList, chapterNumber]);

    // --- RENDER ---
    if (loading)
        return (
            <div className="text-center p-10 text-white">
                Loading Chapter...
            </div>
        );
    if (!currentChapter)
        return (
            <div className="text-center p-10 text-white">
                Chapter tidak ditemukan
            </div>
        );

    return (
        <GuestLayout>
            <div className="max-w-3xl mx-auto min-h-screen bg-gray-900 text-white">
                {/* Header Navigasi */}
                <div className="p-4 flex justify-between items-center bg-gray-800 sticky top-0 z-10 shadow-md">
                    <Link
                        to={`/${slug}`}
                        className="text-blue-400 hover:underline"
                    >
                        &larr; Detail Komik
                    </Link>
                    <h1 className="font-bold text-sm md:text-lg">
                        {comicName} -{" "}
                        {parseFloat(currentChapter.number) < 10
                            ? `Chapter 0${currentChapter.number}`
                            : `Chapter ${currentChapter.number}`}
                    </h1>
                </div>

                {/* Gambar Komik */}
                <div className="flex flex-col items-center w-full bg-black min-h-screen">
                    {currentChapter.images.length > 0 ? (
                        currentChapter.images.map((image) => (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={`Page ${image.page_number}`}
                                loading="lazy"
                                className="w-full max-w-full h-auto object-cover"
                            />
                        ))
                    ) : (
                        <div className="py-20 text-gray-500">
                            Belum ada gambar untuk chapter ini.
                        </div>
                    )}
                </div>

                {/* Footer Navigasi Next/Prev */}

                <div className="p-6 md:p-8 bg-gray-800 mt-4">
                    <div className="grid grid-cols-3">
                        {/* Tombol PREV */}
                        <div className="flex justify-center">
                            {prevChapter ? (
                                <Link
                                    to={`/read/${slug}/${prevChapter.number}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    &laquo; Prev (Ch. {prevChapter.number})
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="text-gray-500 cursor-not-allowed"
                                >
                                    Start
                                </button>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <span className="text-gray-400 text-sm hidden md:block">
                                List Chapter
                            </span>
                        </div>

                        {/* Tombol NEXT */}
                        <div className="flex justify-center">
                            {nextChapter ? (
                                <Link
                                    to={`/read/${slug}/${nextChapter.number}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Next (Ch. {nextChapter.number}) &raquo;
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className=" text-gray-500 cursor-not-allowed"
                                >
                                    End
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default ReadChapter;
