import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Check } from "lucide-react";
import { IGenre } from "@/types/index.type";

type GenreModalSelectorProps = {
    selectedGenres: number[]; // ID yang sudah tersimpan di Form Utama
    onSave: (genres: number[]) => void; // Fungsi buat update Form Utama
    error?: string; // Pesan error dari Zod
};

export default function GenreModalSelector({
    selectedGenres,
    onSave,
    error,
}: GenreModalSelectorProps) {
    const [open, setOpen] = useState(false);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [loading, setLoading] = useState(true);

    // State Sementara (Temp)
    // Ini menampung centangan user SEBELUM tombol Save diklik
    const [tempSelected, setTempSelected] = useState<number[]>([]);

    const fetchGenres = useCallback(async () => {
        try {
            const res = await axios.get("/api/genres");
            console.log(res.data);
            setGenres(res.data.data || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 1. Ambil Data API
    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    console.log("Genres", genres);

    // 2. Sinkronisasi State saat Dialog Dibuka
    // Setiap kali dialog dibuka, isi tempSelected dengan data yang sudah tersimpan (selectedGenres)
    useEffect(() => {
        if (open) {
            setTempSelected(selectedGenres);
        }
    }, [open, selectedGenres]);

    // 3. Handle Centang/Uncentang (Di tataran Temp State)
    const handleToggle = (id: number) => {
        setTempSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // 4. Handle Tombol SAVE
    const handleSave = () => {
        onSave(tempSelected); // Kirim data temp ke Form Utama
        setOpen(false); // Tutup dialog
    };

    return (
        <div className="flex flex-col gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={`w-full justify-between h-auto min-h-[40px] ${
                            error ? "border-red-500 text-red-500" : ""
                        }`}
                    >
                        {selectedGenres.length > 0 ? (
                            <div className="flex flex-wrap gap-1 py-1">
                                {/* Tampilkan Badge genre yang sudah dipilih di tombol trigger */}
                                {selectedGenres.map((id) => {
                                    const genre = genres.find(
                                        (g) => g.id === id
                                    );
                                    return (
                                        <Badge
                                            key={id}
                                            variant="secondary"
                                            className="mr-1"
                                        >
                                            {genre?.name || id}
                                        </Badge>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">
                                Pilih Genre...
                            </span>
                        )}
                        <PlusCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Pilih Genre</DialogTitle>
                        <DialogDescription>
                            Pilih genre yang sesuai. Klik simpan untuk
                            menerapkan perubahan.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Area Checkbox dengan Scroll biar gak kepanjangan */}
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {loading ? (
                            <p className="text-sm text-center">Loading...</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {genres.map((genre) => (
                                    <div
                                        key={genre.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`g-${genre.id}`}
                                            checked={tempSelected.includes(
                                                genre.id
                                            )}
                                            onCheckedChange={() =>
                                                handleToggle(genre.id)
                                            }
                                        />
                                        <Label
                                            htmlFor={`g-${genre.id}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {genre.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                            <Check className="mr-2 h-4 w-4" />
                            Simpan Pilihan ({tempSelected.length})
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Helper text info jumlah */}
            {selectedGenres.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    {selectedGenres.length} genre terpilih.
                </p>
            )}
        </div>
    );
}
