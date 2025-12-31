<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComicRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:comics,slug',
            'author' => 'required|string|max:255',
            'status' => 'required|in:ongoing,completed',
            'type' => 'required|in:manga,manhwa,manhua',
            'synopsis' => 'required|string',
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'genres' => 'required|array',
            'genres.*' => 'exists:genres,id',
        ];
    }
}
