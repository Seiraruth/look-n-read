import { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { IGenre } from "@/types/index.type";

type GenreSelectorProps = {
    selectedGenres: number[];
    onChange: (value: number[]) => void;
};

export default function GenreSelector({
    selectedGenres,
    onChange,
}: GenreSelectorProps) {
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get("/api/genres");
                setGenres(response.data.data || response.data);
            } catch (error) {
                console.error("Gagal mengambil data genre:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    // 2. Logic saat Checkbox diklik
    const handleCheck = (genreId: number) => {
        // Cek apakah genre ini sudah ada di daftar 'selectedGenres'?
        if (selectedGenres.includes(genreId)) {
            // Kalau SUDAH ada, berarti user mau UNCHECK (Hapus dari array)
            const updatedGenres = selectedGenres.filter((id) => id !== genreId);
            onChange(updatedGenres);
        } else {
            // Kalau BELUM ada, berarti user mau CHECK (Tambah ke array)
            const updatedGenres = [...selectedGenres, genreId];
            onChange(updatedGenres);
        }
    };

    if (loading)
        return (
            <p className="text-sm text-muted-foreground">Loading genres...</p>
        );

    if (genres.length === 0)
        return <p className="text-sm text-red-500">Belum ada data genre.</p>;

    return (
        <div className="space-y-3 border rounded-md p-4 bg-card">
            <Label className="text-base font-semibold">Pilih Genre</Label>

            {/* Grid Layout: 2 kolom di HP, 4 kolom di layar besar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={`genre-${genre.id}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-black"
                            // Cek apakah ID ini ada di array selectedGenres?
                            checked={selectedGenres.includes(genre.id)}
                            // Jalankan fungsi handleCheck pas diklik
                            onChange={() => handleCheck(genre.id)}
                        />
                        <label
                            htmlFor={`genre-${genre.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                        >
                            {genre.name}
                        </label>
                    </div>
                ))}
            </div>

            {/* Info kecil di bawah */}
            <p className="text-xs text-muted-foreground mt-2">
                Terpilih: {selectedGenres.length} genre
            </p>
        </div>
    );
}
