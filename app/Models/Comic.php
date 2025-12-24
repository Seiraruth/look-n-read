<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Storage; <--- Hapus ini, gak butuh lagi di sini

class Comic extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comics';
    protected $guarded = ['id'];
    protected $appends = ['image_url'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Accessor URL Gambar
    public function getImageUrlAttribute()
    {
        if ($this->cover_image) {
            return url('storage/' . $this->cover_image);
        }
        return null;
    }

    // Relasi
    public function chapters()
    {
        return $this->hasMany(Chapter::class, 'comic_id', 'id');
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'comic_genre');
    }

    // --- BOOT BERSIH ---
    protected static function boot()
    {
        parent::boot();

        // CUMA SISAKAN INI (Auto Slug)
        static::creating(function ($comic) {
            if (empty($comic->slug)) {
                $comic->slug = Str::slug($comic->title);
            }
        });

        // Logic 'forceDeleting' KITA HAPUS
        // Karena tugas hapus file sudah diambil alih oleh ComicController (deleteDirectory)
    }
}
