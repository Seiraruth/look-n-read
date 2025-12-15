<?php

namespace App\Http\Controllers;

use App\Models\Comic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ComicController extends Controller
{
    /**
     * Display a listing of comics.
     */
    public function index(Request $request)
    {
        $query = Comic::query();

        // Search by title or author
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $comics = $query->latest()->paginate(12);

        return response()->json($comics);
    }

    /**
     * Store a newly created comic.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:comics,slug',
            'author' => 'required|string|max:255',
            'status' => 'required|in:ongoing,completed',
            'type' => 'required|in:manga,manhwa,manhua',
            'synopsis' => 'required|string',
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $image = $request->file('cover_image');
            $imageName = time() . '_' . Str::slug($validated['title']) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('comics/covers', $imageName, 'public');
            $validated['cover_image'] = $imagePath;
        }

        $comic = Comic::create($validated);

        return response()->json([
            'message' => 'Comic created successfully',
            'comic' => $comic
        ], 201);
    }

    /**
     * Display the specified comic.
     */
    public function show(Comic $comic)
    {
        // $comic = Comic::findOrFail($id);
        return response()->json($comic);
    }

    /**
     * Display the specified comic by slug.
     */
    // public function showBySlug($slug)
    // {
    //     $comic = Comic::where('slug', $slug)->firstOrFail();
    //     return response()->json($comic);
    // }

    /**
     * Update the specified comic.
     */
    public function update(Request $request, Comic $comic)
    {

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'author' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:ongoing,completed',
            'type' => 'sometimes|in:manga,manhwa,manhua',
            'synopsis' => 'sometimes|string',
            'cover_image' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old image
            if ($comic->cover_image && Storage::disk('public')->exists($comic->cover_image)) {
                Storage::disk('public')->delete($comic->cover_image);
            }

            $image = $request->file('cover_image');
            $imageName = time() . '_' . Str::slug($request->input('title', $comic->title)) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('comics/covers', $imageName, 'public');
            $validated['cover_image'] = $imagePath;
        }

        // Update slug if title changed
        if (isset($validated['title']) && $validated['title'] !== $comic->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $comic->update($validated);

        return response()->json([
            'message' => 'Comic updated successfully',
            'comic' => $comic
        ]);
    }

    /**
     * Remove the specified comic.
     */
    public function destroy(Comic $comic)
    {
        // $comic = Comic::findOrFail($comic);

        // Delete cover image
        if ($comic->cover_image && Storage::disk('public')->exists($comic->cover_image)) {
            Storage::disk('public')->delete($comic->cover_image);
        }

        $comic->forceDelete();

        return response()->json([
            'message' => 'Comic deleted successfully'
        ]);
    }
}
