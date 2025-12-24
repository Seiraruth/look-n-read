import { Link, useParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react"; // Icon dari lucide-react
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export type TChapters = {
    id: number;
    title: string;
    chapters: {
        id: number;
        comic_id: number;
        title: string;
        slug: string;
        number: number;
        created_at: string;
        updated_at: string;
        published_at: string;
    }[];
};

export default function Chapters() {
    // Anggap 'comic.chapters' adalah data yang didapat dari API Laravel
    const { slug } = useParams();
    const [comic, setComic] = useState<TChapters>();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(`/api/comics/${slug}`);
                setComic(response.data);
            } catch (error) {
                console.error("Chapter.tsx error: ", error);
            }
        };
        load();
    }, []);

    // --- FUNGSI DELETE CHAPTER ---
    const handleDeleteChapter = async (chapterId: number) => {
        // 1. Konfirmasi dulu
        if (
            !window.confirm(
                "Apakah anda yakin ingin menghapus chapter ini? Gambar juga akan terhapus."
            )
        ) {
            return;
        }

        setIsDeleting(chapterId); // Set loading di tombol spesifik
        const token = localStorage.getItem("token");

        try {
            // 2. Panggil API Delete
            await axios.delete(`/api/auth/admin/chapters/${chapterId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 3. Update UI (Hapus dari state tanpa refresh)
            if (comic) {
                const updatedChapters = comic.chapters.filter(
                    (chap) => chap.id !== chapterId
                );
                setComic({ ...comic, chapters: updatedChapters });
            }

            toast.success("Chapter berhasil dihapus");
        } catch (error) {
            console.error("Gagal hapus:", error);
            toast.error("Gagal menghapus chapter");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header Halaman */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Daftar Chapter: {comic?.title}
                    </h1>

                    {/* Tombol Tambah Chapter (Mengarah ke route upload yang tadi kita buat) */}
                    <Link to={`/admin/comics/add/chapter/${slug}/${comic?.id}`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Tambah Chapter
                            Baru
                        </Button>
                    </Link>
                </div>

                {/* Tabel Chapter */}
                <div className="border rounded-lg shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    No. Chapter
                                </TableHead>
                                <TableHead>Judul Chapter</TableHead>
                                <TableHead>Jumlah Halaman</TableHead>
                                <TableHead>Tanggal Upload</TableHead>
                                <TableHead className="text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comic?.chapters.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {item.title}
                                        {/* Tampilkan strip jika tidak ada judul */}
                                    </TableCell>
                                    <TableCell>
                                        {/* Kamu bisa hitung jumlah gambar dari relasi chapter_images */}
                                        {comic.chapters.length} Hal
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString("en-EN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {/* Tombol Edit */}
                                        <Link
                                            to={`/admin/comics/edit/chapter/${slug}/${item.id}`}
                                        >
                                            <Button
                                                variant="outline"
                                                size="icon"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        {/* Tombol Delete */}
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            disabled={isDeleting === item.id}
                                            onClick={() =>
                                                handleDeleteChapter(item.id)
                                            }
                                        >
                                            {isDeleting === item.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
