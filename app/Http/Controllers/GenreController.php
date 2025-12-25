<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    public function index()
    {
        $genres = Genre::orderBy('name', 'asc')->get();
        return response()->json(['data' => $genres]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:genres,name|max:50',
        ]);

        $genre = Genre::create([
            'name' => $request->name
        ]);

        return response()->json(['message' => 'Genre berhasil dibuat', 'data' => $genre]);
    }

    public function update(Request $request, $id)
    {
        $genre = Genre::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:genres,name,' . $id . '|max:50',
        ]);

        $genre->update(['name' => $request->name]);

        return response()->json(['message' => 'Genre berhasil diupdate']);
    }

    public function destroy($id)
    {
        $genre = Genre::findOrFail($id);
        $genre->delete();

        return response()->json(['message' => 'Genre berhasil dihapus']);
    }
}
