<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
// Import model image
use App\Models\ChapterImage;
use App\Models\Comic;
use Illuminate\Support\Facades\DB; // Buat transaksi data (Penting!)
use Illuminate\Support\Facades\Storage;

class ChapterController extends Controller
{
    /**
     * 1. INDEX (PUBLIC)
     * Mengambil daftar chapter (bisa dipanggil terpisah jika perlu).
     * Biasanya client ambil lewat ComicController, tapi ini opsional kalau butuh.
     */
    public function index(Request $request)
    {
        // Bisa filter berdasarkan comic_id kalau dikirim via query params
        // Contoh: /api/chapters?comic_id=1
        $query = Chapter::query();

        if ($request->has('comic_id')) {
            $query->where('comic_id', $request->comic_id);
        }

        // Urutkan dari chapter terbaru
        $chapters = $query->orderBy('number', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $chapters
        ]);
    }

    /**
     * 2. SHOW (PUBLIC)
     * Mengambil detail 1 chapter saja.
     * Nanti di sini kita akan load gambarnya (kalau sudah ada).
     */
    public function show(Chapter $chapter)
    {

        $chapter = Chapter::with(['comic', 'images'])->find($chapter->id);

        if (!$chapter) {
            return response()->json(['message' => 'Chapter not found'], 404);
        }

        return response()->json([
            'data' => $chapter
        ], 200);
    }

    /**
     * 3. STORE (ADMIN ONLY)
     * Membuat Chapter Baru (Hanya Data: Nomor, Judul, Tanggal).
     * Gambar kita skip dulu.
     */
    public function store(Request $request)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'comic_id' => 'required|exists:comics,id',
            'number' => 'required|numeric',
            'title' => 'nullable|string',
            'pages' => 'nullable|array',
            'pages.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // A. Buat Chapter Dulu
            $chapter = Chapter::create([
                'comic_id' => $request->comic_id,
                'number' => $request->number,
                'title' => $request->title,
            ]);

            // B. Loop Upload Gambar (Jika ada)
            if ($request->hasFile('pages')) {

                // --- MODIFIKASI DIMULAI DARI SINI ---

                // 1. Ambil Data Komik (Buat dapat Slug-nya)
                $comic = Comic::findOrFail($request->comic_id);

                // 2. Tentukan Struktur Folder yang Rapi
                // Contoh hasil: comics/15-naruto
                $comicFolder = 'comics/' . $comic->id . '-' . $comic->slug;

                // Contoh hasil: comics/15-naruto/chapters/1
                $chapterFolder = $comicFolder . '/chapters/' . $request->number;

                $uploadedImages = [];

                foreach ($request->file('pages') as $index => $image) {
                    // 3. Nama File Lebih Bersih (page-1.jpg, page-2.jpg)
                    // Tidak perlu ID chapter di nama file karena sudah ada di nama folder
                    $filename = 'page-' . ($index + 1) . '.' . $image->getClientOriginalExtension();

                    // 4. Simpan ke Folder Khusus tadi
                    $path = $image->storeAs($chapterFolder, $filename, 'public');

                    $uploadedImages[] = [
                        'chapter_id' => $chapter->id,
                        'image_path' => $path,
                        'page_number' => $index + 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // --- AKHIR MODIFIKASI ---

                ChapterImage::insert($uploadedImages);
            }

            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Chapter berhasil dibuat dengan struktur folder rapi',
                'data' => $chapter->load('images')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            // Hapus folder chapter jika DB gagal (supaya gak nyampah file kosong)
            // Opsional, tapi bagus buat kebersihan
            if (isset($chapterFolder) && Storage::disk('public')->exists($chapterFolder)) {
                Storage::disk('public')->deleteDirectory($chapterFolder);
            }

            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 4. UPDATE (ADMIN ONLY)
     * Edit Judul atau Nomor Chapter.
     */
    public function update(Request $request, Chapter $chapter)
    {
        // 1. Load Chapter + Comic (Penting: Kita butuh data Comic buat tau nama foldernya)
        // Kita gunakan load() karena $chapter sudah disuntikkan lewat Route Model Binding
        $chapter->load(['comic', 'images']);

        if (!$chapter) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        // 2. Update Data Teks
        $chapter->update([
            'title' => $request->title,
            'number' => $request->number,
            // Slug otomatis dihandle model, atau bisa diupdate manual jika ada request slug
            // 'slug' => $request->slug ?? Str::slug($request->title),
        ]);

        // ---------------------------------------------------------
        // 3. LOGIKA GANTI GAMBAR (REPLACE ALL)
        // ---------------------------------------------------------
        if ($request->hasFile('pages')) {

            // --- A. BERSIHKAN FILE LAMA ---
            // Kita hapus berdasarkan path yang tersimpan di database.
            // Cara ini aman, mau folder lama itu 'messy' atau 'rapi', tetap akan terhapus.
            foreach ($chapter->images as $oldImage) {
                if (Storage::disk('public')->exists($oldImage->image_path)) {
                    Storage::disk('public')->delete($oldImage->image_path);
                }
                $oldImage->delete(); // Hapus data dari DB
            }

            // Opsional: Hapus folder kosong bekas chapter lama (biar bersih)
            // Folder lama (perkiraan): comics/15-naruto/chapters/1
            $folderLama = 'comics/' . $chapter->comic->id . '-' . $chapter->comic->slug . '/chapters/' . $chapter->number;
            if (Storage::disk('public')->exists($folderLama)) {
                Storage::disk('public')->deleteDirectory($folderLama);
            }

            // --- B. UPLOAD GAMBAR BARU (STRUKTUR RAPI) ---

            // 1. Tentukan Target Folder Baru
            // Format: comics/{id}-{slug}/chapters/{nomor}
            $folderTarget = 'comics/' . $chapter->comic->id . '-' . $chapter->comic->slug . '/chapters/' . $request->number;

            $uploadedImages = [];

            foreach ($request->file('pages') as $index => $file) {
                // 2. Nama File Cantik (page-1.jpg)
                $filename = 'page-' . ($index + 1) . '.' . $file->getClientOriginalExtension();

                // 3. Simpan ke Folder Rapi
                $path = $file->storeAs($folderTarget, $filename, 'public');

                // 4. Siapkan Data untuk DB
                $uploadedImages[] = [
                    'chapter_id' => $chapter->id,
                    'image_path' => $path,
                    'page_number' => $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // 5. Masukkan data baru ke DB (Insert Massal)
            ChapterImage::insert($uploadedImages);
        }

        return response()->json(['message' => 'Chapter updated successfully']);
    }

    /**
     * 5. DESTROY (ADMIN ONLY)
     * Hapus Chapter dari database.
     */
    public function destroy(Chapter $chapter)
    {
        // 1. Load Chapter DENGAN Relasi Comic
        // Kenapa? Karena kita butuh 'id' dan 'slug' komiknya buat tau nama foldernya.
        $chapter = Chapter::with('comic')->find($chapter->id);

        if (!$chapter) {
            return response()->json(['message' => 'Chapter tidak ditemukan'], 404);
        }

        try {
            // 2. HAPUS FOLDER FISIK (Logika Folder Rapi)
            // Rumus folder: comics/{comic_id}-{comic_slug}/chapters/{chapter_number}
            // Contoh: comics/15-naruto/chapters/1

            $folderTarget = 'comics/' . $chapter->comic->id . '-' . $chapter->comic->slug . '/chapters/' . $chapter->number;

            if (Storage::disk('public')->exists($folderTarget)) {
                // deleteDirectory = Hapus folder "1" beserta isinya (page-1.jpg, page-2.jpg, dst)
                Storage::disk('public')->deleteDirectory($folderTarget);
            }

            // 3. HAPUS DATA DATABASE
            // Gunakan forceDelete() biar hilang permanen (karena filenya udah kita hapus)
            $chapter->forceDelete();

            return response()->json([
                'status' => 'success',
                'message' => 'Chapter dan file gambarnya berhasil dihapus total'
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal hapus: ' . $e->getMessage()], 500);
        }
    }
}
