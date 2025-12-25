<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genre;

class GenreSeeder extends Seeder
{
    public function run()
    {
        $genres = [
            // --- GENRE UTAMA ---
            'Action',
            'Adventure',
            'Comedy',
            'Drama',
            'Fantasy',
            'Horror',
            'Mystery',
            'Psychological',
            'Romance',
            'Sci-Fi',
            'Slice of Life',
            'Sports',
            'Supernatural',
            'Thriller',
            'Tragedy',

            // --- DEMOGRAFI (Target Pembaca) ---
            'Shounen', // Cowok Remaja
            'Shoujo',  // Cewek Remaja
            'Seinen',  // Cowok Dewasa (Cerita lebih berat)
            'Josei',   // Cewek Dewasa

            // --- TEMA KHUSUS (Sering dicari) ---
            'Isekai',           // Pindah dunia lain
            'Reincarnation',    // Hidup kembali
            'Time Travel',      // Kembali ke masa lalu
            'System',           // Kayak game (Level up, Quest) - Populer di Manhwa
            'Harem',            // 1 Cowok banyak cewek
            'Reverse Harem',    // 1 Cewek banyak cowok
            'Ecchi',            // Agak "nakal" dikit (Opsional, tergantung kebijakan web kamu)
            'School Life',      // Anak sekolahan
            'Magic',
            'Mecha',            // Robot
            'Military',
            'Music',
            'Game',             // Bertema Video Game/VRMMO
            'Police',
            'Post-Apocalyptic', // Dunia hancur
            'Zombie',
            'Vampire',
            'Ghost',
            'Monsters',
            'Demons',
            'Gods',             // Dewa-dewa

            // --- KHUSUS MANHWA / MANHUA (Cina & Korea) ---
            'Murim',            // Dunia persilatan Korea
            'Martial Arts',     // Bela diri
            'Wuxia',            // Bela diri Cina (Fantasi ringan)
            'Xianxia',          // Cultivation (Dewa/Abadi) Cina
            'Cultivation',      // Bertapa menaikkan level kekuatan
            'Historical',       // Kerajaan jaman dulu
            'Royalty',          // Pangeran/Putri kerajaan
            'Villainess',       // Jadi penjahat (Populer di Manhwa cewek)
            'Office Workers',   // Cerita kantoran

            // --- FORMAT ---
            'Webtoon',          // Format memanjang ke bawah
            '4-Koma',           // Komik strip 4 panel
            'Oneshot',          // Langsung tamat 1 chapter
            'Doujinshi',        // Karya fans
        ];

        // Sortir abjad biar rapi di database
        sort($genres);

        foreach ($genres as $genreName) {
            Genre::firstOrCreate(['name' => $genreName]);
        }
    }
}
