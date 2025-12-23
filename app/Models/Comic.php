<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Comic extends Model
{
    use HasFactory, SoftDeletes; // Pastikan tabel comics punya kolom 'deleted_at'

    protected $table = 'comics';
    protected $guarded = ['id'];

    // Menambahkan field 'image_url' ke dalam JSON otomatis
    protected $appends = ['image_url'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * ACCESSOR: Image URL
     * Mengubah path database (covers/naruto.jpg) jadi URL lengkap (http://.../storage/covers/naruto.jpg)
     */
    public function getImageUrlAttribute()
    {
        // Sesuaikan 'cover_image' dengan nama kolom di database kamu.
        // Kalau di database namanya 'image_path', ganti jadi $this->image_path
        if ($this->cover_image) {
            return url('storage/' . $this->cover_image);
        }

        return null; // Return null kalau tidak ada gambar (jangan error)
    }

    /**
     * RELASI: One Comic has Many Chapters
     */
    public function chapters()
    {
        // Parameter kedua ('comic_id') adalah nama kolom foreign key di tabel chapters
        return $this->hasMany(Chapter::class, 'comic_id', 'id');
    }

    /**
     * RELASI: Many-to-Many Genres (Opsional)
     */
    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'comic_genre');
    }

    /**
     * BOOT: Auto Generate Slug
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($comic) {
            if (empty($comic->slug)) {
                $comic->slug = Str::slug($comic->title);
            }
        });
    }
}
