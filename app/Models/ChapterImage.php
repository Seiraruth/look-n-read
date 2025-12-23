<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChapterImage extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Accessor: Biar frontend langsung dapet URL lengkap (http://...)
    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return url('storage/' . $this->image_path);
    }

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }
}