<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComicController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PublicComicController;

/*
|--------------------------------------------------------------------------
| 1. PUBLIC ROUTES (GUEST / PEMBACA)
|--------------------------------------------------------------------------
| Siapa saja boleh akses (Tanpa Login).
| Digunakan untuk Halaman Depan & Halaman Baca.
*/

// Group Komik
Route::get('/comics', [ComicController::class, 'index']); // List Komik
Route::get('/comics/{comic:slug}', [ComicController::class, 'show']); // Detail Komik

// Group Chapter
Route::get('/chapters', [ChapterController::class, 'index']); // List Chapter (opsional)
Route::get('/chapters/{chapter:id}', [ChapterController::class, 'show']); // Detail Chapter (Baca Gambar)

Route::get('/read/{comic:slug}/{chapter:number}', [PublicComicController::class, 'read']);

Route::get('/genres', [GenreController::class, 'index']); // Public (biar guest bisa filter)

/*
|--------------------------------------------------------------------------
| 2. ADMIN ROUTES (PROTECTED / KHUSUS ADMIN)
|--------------------------------------------------------------------------
| Wajib Login (Punya Token).
| Digunakan untuk Dashboard, Upload, Edit, Hapus.
*/

Route::prefix('auth/admin')->group(function () {

    // A. Login Admin (Pintu Masuk - Tidak butuh token)
    Route::post('/login', [AuthController::class, 'adminLogin']);
    // B. Area Terkunci (Wajib Token Sanctum)
    Route::middleware('auth:sanctum')->group(function () {

        // --- AUTH ADMIN ---
        Route::post('/logout', [AuthController::class, 'adminLogout']);
        Route::get('/me', [AuthController::class, 'adminMe']);

        // --- MANAGE COMICS (C.U.D) ---
        Route::post('/comics', [ComicController::class, 'store']);
        Route::put('/comics/{comic:slug}', [ComicController::class, 'update']);
        Route::delete('/comics/{comic:id}', [ComicController::class, 'destroy']);

        // --- MANAGE CHAPTERS (C.U.D) ---
        Route::post('/chapters', [ChapterController::class, 'store']);
        Route::put('/chapters/{chapter:id}', [ChapterController::class, 'update']);
        Route::delete('/chapters/{chapter:id}', [ChapterController::class, 'destroy']);

        // --- MANAGE GENRES (C.U.D) ---
        Route::post('/genres', [GenreController::class, 'store']);
        Route::put('/genres/{id}', [GenreController::class, 'update']);
        Route::delete('/genres/{id}', [GenreController::class, 'destroy']);
    });
});
