<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Genre extends Model
{
    use HasFactory;

    protected $table = 'genres';
    protected $fillable = ['name', 'slug'];

    public function comics(): BelongsToMany
    {
        return $this->belongsToMany(Comic::class, 'comic_genre');
    }

    // (Opsional tapi Recommended)
    // Biar kalau nanti input lewat Admin Panel gak perlu mikirin slug manual
    protected static function boot()
    {
        parent::boot();
        static::saving(function ($genre) {
            if (empty($genre->slug)) {
                $genre->slug = Str::slug($genre->name);
            }
        });
    }
}
