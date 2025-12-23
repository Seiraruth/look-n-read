<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
// Import model image
use App\Models\ChapterImage;
use Illuminate\Support\Facades\DB; // Buat transaksi data (Penting!)

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

        if (!$chapter) {
            return response()->json(['message' => 'Chapter tidak ditemukan'], 404);
        }

        // Nanti kalau image sudah ada, kita tambahkan ->load('images') di sini.
        // Sekarang cukup data chapter-nya saja.

        return response()->json([
            'status' => 'success',
            'data' => $chapter
        ]);
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
            // Validasi Array Gambar (pages[])
            'pages' => 'nullable|array',
            'pages.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB per gambar
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Gunakan DB Transaction: Kalau upload gambar gagal di tengah jalan, 
        // data chapter yang terlanjur dibuat akan dibatalkan otomatis.
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
                $uploadedImages = [];

                // Loop setiap file yang dikirim
                foreach ($request->file('pages') as $index => $image) {
                    // Nama file unik
                    $filename = $chapter->id . '-page-' . ($index + 1) . '.' . $image->getClientOriginalExtension();

                    // Simpan ke folder: storage/app/public/chapter-pages
                    $path = $image->storeAs('chapter-pages', $filename, 'public');

                    // Masukkan ke array data
                    $uploadedImages[] = [
                        'chapter_id' => $chapter->id,
                        'image_path' => $path,
                        'page_number' => $index + 1, // Urutan halaman (1, 2, 3...)
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Insert massal ke database (lebih cepat daripada satu-satu)
                ChapterImage::insert($uploadedImages);
            }

            DB::commit(); // Simpan permanen

            // Return data lengkap dengan images
            return response()->json([
                'status' => 'success',
                'message' => 'Chapter dan Pages berhasil diupload',
                'data' => $chapter->load('images')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua jika error
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 4. UPDATE (ADMIN ONLY)
     * Edit Judul atau Nomor Chapter.
     */
    public function update(Request $request, $id)
    {
        $chapter = Chapter::find($id);

        if (!$chapter) {
            return response()->json(['message' => 'Chapter tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter_number' => 'numeric',
            'title' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $chapter->update([
                'number' => $request->chapter_number ?? $chapter->number,
                'title' => $request->title ?? $chapter->title,
                'published_at' => $request->has('published_at') ? $request->published_at : $chapter->published_at,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Chapter berhasil diupdate',
                'data' => $chapter
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal update: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 5. DESTROY (ADMIN ONLY)
     * Hapus Chapter dari database.
     */
    public function destroy($id)
    {
        $chapter = Chapter::find($id);

        if (!$chapter) {
            return response()->json(['message' => 'Chapter tidak ditemukan'], 404);
        }

        try {
            // Hapus data (Nanti kalau ada images, kita tambah logika hapus file di sini)
            $chapter->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Chapter berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal hapus: ' . $e->getMessage()], 500);
        }
    }
}
