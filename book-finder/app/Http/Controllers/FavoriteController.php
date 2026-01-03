<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FavoriteController extends Controller
{
    public function toggleFavorite(Request $request): JsonResponse
    {
        $request->validate([
            'book_id' => 'required|exists:books,id'
        ]);
        $user = $request->user();

        $status = $user->favoriteBooks()->toggle($request->book_id);

        $attached = count($status['attached']) > 0;

        return response()->json([
            'status' => 'success',
            'message' => $attached ? 'Added to favorites' : 'Removed from favorites',
            'is_favorite' => $attached
        ]);
    }

    public function listFavorites(Request $request): JsonResponse
    {
        $user = $request->user();
        $favorites = $user->favoriteBooks()->get();

        return response()->json([
            'status' => 'success',
            'favorites' => $favorites
        ]);
    }
}
