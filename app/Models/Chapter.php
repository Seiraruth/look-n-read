<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Chapter extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'comic_id',
        'title',
        'slug',
        'number',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($chapter) {
            if (empty($chapter->slug)) {
                $chapter->slug = Str::slug($chapter->title);
            }
        });
    }

    public function comic()
    {
        return $this->belongsTo(Comic::class);
    }

    public function images()
    {
        return $this->hasMany(ChapterImage::class);
    }
}