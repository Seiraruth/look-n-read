<?php

namespace App\Http\Controllers;

use App\Models\Comic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ComicController extends Controller
{
    /**
     * Display a listing of comics.
     */
    public function index(Request $request)
    {
        $query = Comic::query();

        // Search by title or author
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $comics = $query->latest()->paginate(12);

        return response()->json($comics);
    }

    /**
     * Store a newly created comic.
     */
    public function store(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:comics,slug',
            'author' => 'required|string|max:255',
            'status' => 'required|in:ongoing,completed',
            'type' => 'required|in:manga,manhwa,manhua',
            'synopsis' => 'required|string',
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Gunakan Transaction biar aman (kalau upload gagal, data gak masuk DB)
        try {
            DB::beginTransaction();

            // 2. Buat Comic Dulu (Tanpa Gambar Cover)
            // Kita butuh ID-nya terbentuk dulu supaya bisa bikin nama folder "15-naruto"
            // Jadi kita buang dulu 'cover_image' dari array data
            $dataWithoutFile = Arr::except($validated, ['cover_image']);

            $comic = Comic::create($dataWithoutFile);

            // 3. Proses Upload Cover
            if ($request->hasFile('cover_image')) {

                // Sekarang kita udah punya ID ($comic->id)
                // Nama Folder: comics/15-naruto
                $folderName = 'comics/' . $comic->id . '-' . $comic->slug;

                // Nama File: cover.jpg (Lebih rapi daripada pakai timestamp panjang)
                $file = $request->file('cover_image');
                $filename = 'cover.' . $file->getClientOriginalExtension();

                // Simpan ke storage
                $path = $file->storeAs($folderName, $filename, 'public');

                // 4. Update Comic dengan Path Gambar yang baru didapat
                $comic->update(['cover_image' => $path]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Comic created successfully',
                'comic' => $comic
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            // Hapus folder kalau error (biar gak nyampah folder kosong)
            if (isset($folderName) && Storage::disk('public')->exists($folderName)) {
                Storage::disk('public')->deleteDirectory($folderName);
            }

            return response()->json(['message' => 'Failed to create comic: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified comic.
     */
    public function show(Comic $comic): JsonResponse
    {
        try {
            // $comic = Comic::where('slug', $comic->slug);

            if (!$comic)
                return response()->json(['msg' => 'Gak ketemu'], 404);

            // Bagian yang bikin error
            $comic->load('chapters');

            return response()->json($comic);

        } catch (\Exception $e) {
            // INI AKAN MENAMPILKAN PENYEBAB ASLINYA
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(), // Baca pesan ini!
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Display the specified comic by slug.
     */
    // public function showBySlug($slug)
    // {
    //     $comic = Comic::where('slug', $slug)->firstOrFail();
    //     return response()->json($comic);
    // }

    /**
     * Update the specified comic.
     */
    public function update(Request $request, Comic $comic)
    {
        // Simpan slug lama buat referensi nama folder lama
        $oldSlug = $comic->slug;

        // 1. Validasi
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:comics,slug,' . $comic->id,
            'author' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:ongoing,completed',
            'type' => 'sometimes|in:manga,manhwa,manhua',
            'synopsis' => 'sometimes|string',
            'cover_image' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // 2. Cek Slug Baru
        if ($request->has('title') && $request->title !== $comic->title) {
            $validated['slug'] = Str::slug($request->title);
        }
        if ($request->has('slug') && $request->slug !== $comic->slug) {
            $validated['slug'] = Str::slug($request->slug);
        }

        $newSlug = isset($validated['slug']) ? $validated['slug'] : $oldSlug;

        // -----------------------------------------------------------
        // FITUR TAMBAHAN: RENAME FOLDER JIKA SLUG BERUBAH
        // -----------------------------------------------------------
        if ($oldSlug !== $newSlug) {
            $oldFolder = 'comics/' . $comic->id . '-' . $oldSlug;
            $newFolder = 'comics/' . $comic->id . '-' . $newSlug;

            // Cek kalau folder lama ada, kita ganti namanya (Move)
            if (Storage::disk('public')->exists($oldFolder)) {
                Storage::disk('public')->move($oldFolder, $newFolder);
            }
        }

        // 3. Handle Cover Image
        if ($request->hasFile('cover_image')) {
            // Hapus lama
            if ($comic->cover_image && Storage::disk('public')->exists($comic->cover_image)) {
                Storage::disk('public')->delete($comic->cover_image);
            }

            // Simpan baru (ke folder yang slug-nya sudah baru/lama)
            $folderName = 'comics/' . $comic->id . '-' . $newSlug;
            $file = $request->file('cover_image');
            $filename = 'cover.' . $file->getClientOriginalExtension();
            $path = $file->storeAs($folderName, $filename, 'public');

            $validated['cover_image'] = $path;
        }
        // PENTING: Jika slug berubah TAPI cover tidak diganti,
        // path cover di database harus diupdate juga karena nama foldernya berubah!
        elseif ($oldSlug !== $newSlug && $comic->cover_image) {
            // Update string path di database dari '...-naruto/...' jadi '...-naruto-shippuden/...'
            $validated['cover_image'] = str_replace($oldSlug, $newSlug, $comic->cover_image);
        }

        // 4. Update DB
        $comic->update($validated);

        // Jangan lupa update path gambar di semua chapter (karena folder induknya ganti nama)
        if ($oldSlug !== $newSlug) {
            foreach ($comic->chapters as $chap) {
                foreach ($chap->images as $img) {
                    $newPath = str_replace($oldSlug, $newSlug, $img->image_path);
                    $img->update(['image_path' => $newPath]);
                }
            }
        }

        return response()->json([
            'message' => 'Comic updated successfully',
            'comic' => $comic
        ]);
    }

    /**
     * Remove the specified comic.
     */
    public function destroy(Comic $comic)
    {
        // 1. Ambil Data (Gunakan withTrashed jaga-jaga kalau statusnya soft deleted)
        $comic = Comic::withTrashed()->find($comic->id);

        if (!$comic) {
            return response()->json(['message' => 'Comic not found'], 404);
        }

        // ---------------------------------------------------------
        // TAHAP 1: HAPUS FOLDER FISIK (SEKALIGUS)
        // ---------------------------------------------------------
        // Karena struktur kita: comics/15-naruto/...
        // Kita cukup hapus folder "15-naruto" itu, maka isinya (cover + chapters) ikut hilang.

        $folderTarget = 'comics/' . $comic->id . '-' . $comic->slug;

        if (Storage::disk('public')->exists($folderTarget)) {
            // deleteDirectory = Hapus folder beserta seluruh anak cucunya
            Storage::disk('public')->deleteDirectory($folderTarget);
        }

        // ---------------------------------------------------------
        // TAHAP 2: HAPUS DATA DATABASE
        // ---------------------------------------------------------

        // Hapus semua data chapter di database (Mass Delete)
        // Kita tidak butuh loop satu-satu lagi karena filenya sudah dihapus di Tahap 1.
        $comic->chapters()->forceDelete();

        // Hapus data komik
        $comic->forceDelete();

        return response()->json([
            'message' => 'Comic and all files deleted successfully'
        ]);
    }
}
