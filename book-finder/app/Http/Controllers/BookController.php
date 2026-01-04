<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BookController extends Controller
{
    public function getBooks(Request $request)
    {
        try {
            $request->validate([
                'query' => 'required|string|max:255',
            ]);

            $query = $request->input('query');

            $response = Http::get("https://www.googleapis.com/books/v1/volumes", [
                'q' => $query
            ]);

            if ($response->failed()) return [];

            $books = collect($response->json()['items'] ?? [])->map(function ($item) {
                $info = $item['volumeInfo'] ?? [];

                $isbns = collect($info['industryIdentifiers'] ?? []);
                $isbnObj = $isbns->firstWhere('type', 'ISBN_13') ?? $isbns->first();
                $isbn = $isbnObj['identifier'] ?? 'N/A';

                return [
                    'title' => $info['title'] ?? null,
                    'authors' => $info['authors'] ?? [],
                    'isbn' => $isbn,
                    'cover_url' => $info['imageLinks']['thumbnail'] ?? null,
                ];
            });

            return response()->json([
                'status' => 'success',
                'books' => $books
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch books', 'message' => $e->getMessage()], 400);
        }
    }

    public function saveBook(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'author' => 'required|max:255',
                'isbn' => 'required|string|max:20|unique:books,isbn',
                'cover_url' => 'nullable|url',
            ]);

            $book = Book::create([
                'title' => $request->input('title'),
                'author' => is_array($request->author) ? implode(', ', $request->author) : $request->author,
                'isbn' => $request->input('isbn'),
                'cover_url' => $request->input('cover_url'),
            ]);

            return response()->json([
                'status' => 'success',
                'book' => new BookResource($book)
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create book', 'message' => $e->getMessage()], 400);
        }
    }

    public function getSavedBooks(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 5);
            $books = Book::paginate($perPage);

            return response()->json([
                'status' => 'success',
                'books' => BookResource::collection($books), // transforms each book
                'pagination' => [
                    'current_page' => $books->currentPage(),
                    'per_page' => $books->perPage(),
                    'total' => $books->total(),
                    'last_page' => $books->lastPage(),
                    'next_page_url' => $books->nextPageUrl(),
                    'prev_page_url' => $books->previousPageUrl(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch saved books', 'message' => $e->getMessage()], 400);
        }
    }
}
