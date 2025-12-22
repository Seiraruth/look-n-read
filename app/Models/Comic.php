<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Comic extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'author',
        'status',
        'type',
        'synopsis',
        'cover_image',
    ];

    protected $appends = ["image_url"];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function getImageUrlAttribute()
    {
        // if has cover_image in database, merge with url domain
        if ($this->cover_image) {
            return url('storage/', $this->cover_image);
        }

        // if not have the cover_image in database, you can return null or default cover
        return null;
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    // Automatically generate slug from title
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
