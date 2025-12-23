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
import { Trash2, Edit, Plus } from "lucide-react"; // Icon dari lucide-react
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export type TChapters = {
    title: string;
    chapters: [
        {
            id: number;
            comic_id: number;
            title: string;
            slug: string;
            number: number;
            created_at: string;
            updated_at: string;
            published_at: string;
        }
    ];
};

export default function Chapters() {
    // Anggap 'comic.chapters' adalah data yang didapat dari API Laravel
    const { id } = useParams();
    const [comic, setComic] = useState<TChapters>();

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(`/api/comics/${id}`);
                setComic(response.data);
            } catch (error) {
                console.error("Chapter.tsx error: ", error);
            }
        };
        load();
    }, []);

    console.log(comic);

    return (
        <AdminLayout>
            <div className="p-8">
                {/* Header Halaman */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Daftar Chapter: {comic?.title}
                    </h1>

                    {/* Tombol Tambah Chapter (Mengarah ke route upload yang tadi kita buat) */}
                    <Link to={`/admin/comics/${id}/chapters`}>
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
                                        <Button variant="outline" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        {/* Tombol Delete */}
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                        >
                                            <Trash2 className="h-4 w-4" />
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
