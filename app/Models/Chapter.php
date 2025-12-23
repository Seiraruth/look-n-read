<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    use HasFactory;

    protected $table = 'chapters';
    protected $guarded = ['id'];

    // Casting tipe data biar akurat
    protected $casts = [
        'published_at' => 'datetime',
        'number' => 'float', // Biar chapter 10.5 gak dianggap string
    ];

    /**
     * RELASI: Chapter belongs to Comic
     */
    public function comic()
    {
        return $this->belongsTo(Comic::class, 'comic_id', 'id');
    }

    /**
     * RELASI: Chapter has Many Images (Halaman)
     * (Nanti kalau kamu sudah buat model ChapterImage)
     */
    public function images()
    {
        // Urutkan berdasarkan nomor halaman (page_number) biar bacanya gak loncat
        return $this->hasMany(ChapterImage::class)->orderBy('page_number', 'asc');
    }
}
