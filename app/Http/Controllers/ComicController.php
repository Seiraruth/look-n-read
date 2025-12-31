<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreComicRequest;
use App\Models\Comic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ComicController extends Controller
{
    /**
     * Display a listing of comics.
     */
    public function index(Request $request): JsonResponse
    {
        // 1. PENTING: Tambahkan with('genres') biar datanya ke-load
        $query = Comic::with(['genres', 'chapters']);

        // Search by title or author
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
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

        // 2. BARU: Filter by Genre
        // Logic: Cari komik yang PUNYA (whereHas) genre dengan ID tertentu
        if ($request->has('genre')) {
            $genreParam = $request->input('genre');
            $query->whereHas('genres', function ($q) use ($genreParam) {
                $q->where('slug', $genreParam);
            });
        }

        $comics = $query->latest()->get();

        return response()->json([
            'data' => $comics
        ]);
    }

    /**
     * Store a newly created comic.
     */
    public function store(StoreComicRequest $request): JsonResponse
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $dataToCreate = Arr::except($validated, ['cover_image', 'genres']);
            $dataToCreate['cover_image'] = 'pending';

            $comic = Comic::create($dataToCreate);

            if ($request->has('genres')) {
                $comic->genres()->attach($request->genres);
            }

            // 5. Proses Upload Cover
            if ($request->hasFile('cover_image')) {
                // Nama Folder: comics/15-naruto
                $folderName = 'comics/' . $comic->id . '-' . $comic->slug;

                // Nama File: cover.jpg
                $file = $request->file('cover_image');
                $filename = 'cover.' . $file->getClientOriginalExtension();

                // Simpan ke storage
                $path = $file->storeAs($folderName, $filename, 'public');

                // Update Comic dengan Path Gambar yang Asli
                $comic->update(['cover_image' => $path]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Comic created successfully',
                // Kita load('genres') supaya frontend langsung dapet data genrenya juga
                'comic' => $comic->load('genres')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            // Hapus folder kalau error
            if (isset($folderName) && Storage::disk('public')->exists($folderName)) {
                Storage::disk('public')->deleteDirectory($folderName);
            }

            return response()->json(['message' => 'Failed to create comic: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified comic.
     */
    /**
     * Display the specified comic.
     */
    public function show(Comic $comic): JsonResponse
    {
        try {
            if (!$comic)
                return response()->json(['msg' => 'Gak ketemu'], 404);

            // Bagian yang bikin error
            $comic->load(['chapters', 'genres']);

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

    public function update(Request $request, Comic $comic): JsonResponse
    {
        // Simpan slug lama buat referensi nama folder lama
        $oldSlug = $comic->slug;

        // 1. Validasi (Ditambah Validasi Genre)
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:comics,slug,' . $comic->id,
            'author' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:ongoing,completed',
            'type' => 'sometimes|in:manga,manhwa,manhua',
            'synopsis' => 'sometimes|string',
            'cover_image' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',

            // --- VALIDASI GENRE ---
            'genres' => 'sometimes|array',
            'genres.*' => 'exists:genres,id',
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
            $validated['cover_image'] = str_replace($oldSlug, $newSlug, $comic->cover_image);
        }

        // 4. Update DB (Comic Data)
        // PENTING: Kita harus buang 'genres' dari array validated sebelum update ke tabel comics
        // Karena tabel comics tidak punya kolom 'genres'.
        $comicData = Arr::except($validated, ['genres']);

        $comic->update($comicData);

        // 5. SYNC GENRES (Relasi Many-to-Many)
        // Ini akan otomatis hapus relasi lama dan ganti dengan yang baru
        if ($request->has('genres')) {
            $comic->genres()->sync($request->genres);
        }

        // 6. Update Path Gambar Chapter (Jika Folder Berubah)
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
            // Load genres biar data balikan ke frontend lengkap
            'comic' => $comic->load('genres')
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
