<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComicController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('auth/admin')->group(function () {
    Route::post('/login', [AuthController::class, 'adminLogin']);
    Route::post('/logout', [AuthController::class, 'adminLogout'])
        ->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'adminMe'])
        ->middleware('auth:sanctum');
    Route::post('/refresh', [AuthController::class, 'adminRefresh'])
        ->middleware('auth:sanctum');
    // Comic Routes
    Route::get('/comics', [ComicController::class, 'index']); // List all comics
    Route::post('/comics', [ComicController::class, 'store']); // Create comic
    Route::get('/comics/{comic:id}', [ComicController::class, 'show']); // Show by ID
    Route::get('/comics/slug/{slug}', [ComicController::class, 'showBySlug']); // Show by slug
    Route::put('/comics/{id}', [ComicController::class, 'update']); // Update comic
    Route::delete('/comics/{comic:id}', [ComicController::class, 'destroy']); // Delete comic
});

