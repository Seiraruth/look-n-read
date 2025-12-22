<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->id();

            // relasi ke comics
            $table->foreignId('comic_id')
                  ->constrained('comics')
                  ->onDelete('cascade');

            // info chapter
            $table->integer('chapter_number');
            $table->string('title')->nullable();
            $table->longText('content')->nullable(); 
            // bisa untuk teks, atau nanti ganti jadi path gambar

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
