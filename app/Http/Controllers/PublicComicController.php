<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Comic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicComicController extends Controller
{
    public function read($slug, $chapterNumber)
    {
        // 1. Cari Komik berdasarkan Slug
        $comic = Comic::where('slug', $slug)->firstOrFail();

        // 2. Cari Chapter berdasarkan komik_id dan nomor chapter
        $chapter = Chapter::where('comic_id', $comic->id)
            ->where('number', $chapterNumber)
            ->with([
                'images' => function ($query) {
                    // PENTING: Urutkan gambar berdasarkan page_number (asc)
                    // Biar halaman 1 gak ketuker sama halaman 10
                    $query->orderBy('page_number', 'asc');
                }
            ])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $chapter
        ]);
    }
}
