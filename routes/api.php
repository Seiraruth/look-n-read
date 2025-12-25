<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComicController;
use App\Http\Controllers\ChapterController;
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
        // Create (Upload Komik Baru)
        Route::post('/comics', [ComicController::class, 'store']);
        // Update (Edit Komik)
        Route::put('/comics/{comic:slug}', [ComicController::class, 'update']);
        // Delete (Hapus Komik)
        Route::delete('/comics/{comic:id}', [ComicController::class, 'destroy']);

        // --- MANAGE CHAPTERS (C.U.D) ---
        // Create (Upload Chapter Baru)
        Route::post('/chapters', [ChapterController::class, 'store']);
        // Update (Edit Chapter)
        Route::put('/chapters/{chapter:id}', [ChapterController::class, 'update']);
        // Delete (Hapus Chapter)
        Route::delete('/chapters/{chapter:id}', [ChapterController::class, 'destroy']);
        // Show (Khusus Admin, jika butuh data mentah buat form edit)
        // Route::get('/chapters/{chapter}', [ChapterController::class, 'show']);
    });
});
