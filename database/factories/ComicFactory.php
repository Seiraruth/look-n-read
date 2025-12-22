<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Comic;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comic>
 */
class ComicFactory extends Factory
{
    protected $model = Comic::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'author' => fake()->name(),
            'status' => fake()->randomElement(['ongoing', 'completed']),
            'type' => fake()->randomElement(['manga', 'manhwa', 'manhua']),
            'synopsis' => fake()->paragraphs(3, true),
            'cover_image' => 'covers/' . Str::slug($title) . '.jpg',
        ];
    }
}
