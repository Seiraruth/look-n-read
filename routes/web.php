<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// KODE AJAIB:
// Artinya: "Apapun URL yang diketik user, tolong kembalikan view 'welcome' (React)"
// Biarkan React Router yang mengurus sisanya.
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');
