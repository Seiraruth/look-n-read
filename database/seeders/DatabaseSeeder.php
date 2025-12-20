<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CreateAdminUser::class,
        ]);

        // Create comics and chapters
        \App\Models\Comic::factory()->count(10)->create()->each(function ($comic) {
            $total = rand(6, 20);
            for ($i = 1; $i <= $total; $i++) {
                \App\Models\Chapter::factory()
                    ->for($comic)
                    ->state([
                        'number' => $i,
                        'title' => 'Chapter ' . $i . ': ' . fake()->sentence(3),
                        'slug' => \Illuminate\Support\Str::slug('chapter-' . $i . '-' . fake()->word()),
                    ])->create();
            }
        });
    }
}
