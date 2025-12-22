<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Chapter;
use App\Models\Comic;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chapter>
 */
class ChapterFactory extends Factory
{
    protected $model = Chapter::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);
        $number = fake()->numberBetween(1, 300);
        $isPublished = fake()->boolean(80);

        return [
            'comic_id' => Comic::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'number' => $number,
            'body' => fake()->paragraphs(4, true),
            'is_published' => $isPublished,
            'published_at' => $isPublished ? fake()->dateTimeBetween('-2 years', 'now') : null,
        ];
    }
}
