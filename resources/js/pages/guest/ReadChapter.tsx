import GuestLayout from "@/components/layouts/guest/GuestLayout";
import { getApi } from "@/services/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// 1. Definisikan Tipe Data Image & Chapter
type TChapterImage = {
    id: number;
    image_path: string;
    page_number: number;
    url: string; // Pastikan di Model Laravel ada appends ['url']
};

type TChapterDetail = {
    id: number;
    title: string;
    number: string; // atau number
    comic_id: number;
    images: TChapterImage[]; // Array gambar
};

const ReadChapter = () => {
    // Ambil slug dan chapterNumber dari URL (misal: /read/naruto/1)
    const { slug, chapterNumber } = useParams();

    const [chapter, setChapter] = useState<TChapterDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Panggil API Laravel yang tadi kita buat
                const res = await axios.get(
                    `/api/read/${slug}/${chapterNumber}`
                );
                console.log("res", res?.data.data);
                setChapter(res?.data.data);
            } catch (error) {
                console.error("Gagal load chapter:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug, chapterNumber]);

    if (loading)
        return <div className="text-center p-10">Loading Chapter...</div>;
    if (!chapter)
        return <div className="text-center p-10">Chapter tidak ditemukan</div>;

    return (
        <GuestLayout>
            <div className="max-w-3xl mx-auto min-h-screen bg-gray-900 text-white">
                {/* Header Navigasi Kecil */}
                <div className="p-4 flex justify-between items-center bg-gray-800 sticky top-0 z-10 shadow-md">
                    <Link
                        to={`/${slug}`}
                        className="text-blue-400 hover:underline"
                    >
                        &larr; Kembali ke Detail
                    </Link>
                    <h1 className="font-bold">
                        Chapter {chapter.number}{" "}
                        {chapter.title ? `- ${chapter.title}` : ""}
                    </h1>
                </div>

                <div className="flex flex-col items-center w-full bg-black">
                    {chapter.images.map((image) => (
                        <img
                            key={image.id}
                            src={image.url}
                            alt={`Page ${image.page_number}`}
                            loading="lazy" // Biar hemat kuota & cepet (lazy load)
                            className="w-full max-w-full h-auto object-cover"
                        />
                    ))}
                </div>

                {/* Navigasi Next/Prev Chapter (Opsional nanti) */}
                <div className="p-8 text-center bg-gray-800 mt-4">
                    <p>End of Chapter</p>
                </div>
            </div>
        </GuestLayout>
    );
};

export default ReadChapter;
