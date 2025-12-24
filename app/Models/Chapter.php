<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Storage; <--- Hapus ini

class Chapter extends Model
{
    use HasFactory;

    protected $table = 'chapters';
    protected $guarded = ['id'];

    protected $casts = [
        'published_at' => 'datetime',
        'number' => 'float',
    ];

    public function comic()
    {
        return $this->belongsTo(Comic::class, 'comic_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(ChapterImage::class)->orderBy('page_number', 'asc');
    }

    // --- BOOT BERSIH ---
    protected static function boot()
    {
        parent::boot();

        // CUMA SISAKAN INI (Auto Slug)
        static::creating(function ($chapter) {
            if (empty($chapter->slug)) {
                // Logic slug cadangan kalau kosong
                $titleSource = $chapter->title ? $chapter->title : 'chapter-' . $chapter->number;
                $chapter->slug = Str::slug($titleSource);
            }
        });

        // Logic 'deleting' KITA HAPUS
        // Karena tugas hapus file sudah diambil alih oleh ChapterController (deleteDirectory)
    }
}
