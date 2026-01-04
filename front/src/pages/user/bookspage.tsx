/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  cover_url: string | null;
  is_favorite?: boolean;
}

interface PaginationData {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface ApiResponse {
  status: string;
  books: Book[];
  pagination: PaginationData;
}

export default function BooksPage() {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [favoritingBooks, setFavoritingBooks] = useState<Set<number>>(new Set());

  const fetchBooks = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/listbooks?page=${page}&per_page=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch books");

      const data: ApiResponse = await response.json();
      setBooks(data.books || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleToggleFavorite = async (bookId: number) => {
    setFavoritingBooks((prev) => new Set(prev).add(bookId));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/togglefavorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (!response.ok) throw new Error("Failed to toggle favorite");

      const data = await response.json();

      setBooks((prev) => prev.map((book) => (book.id === bookId ? { ...book, is_favorite: data.is_favorite } : book)));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite");
    } finally {
      setFavoritingBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Books</h1>
          <p className="text-gray-600">Browse our collection of books</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : books.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No books available</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      {book.cover_url ? (
                        <img src={book.cover_url} alt={book.title} className="w-full h-48 object-cover rounded" />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">No Cover</span>
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant={book.is_favorite ? "default" : "secondary"}
                        className="absolute top-2 right-2"
                        onClick={() => handleToggleFavorite(book.id)}
                        disabled={favoritingBooks.has(book.id)}
                      >
                        <Heart className={`w-4 h-4 ${book.is_favorite ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">by {book.author}</p>
                    <Badge variant="secondary" className="text-xs">
                      ISBN: {book.isbn}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <Button variant="outline" onClick={() => fetchBooks(pagination.current_page - 1)} disabled={!pagination.prev_page_url}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>

                <Button variant="outline" onClick={() => fetchBooks(pagination.current_page + 1)} disabled={!pagination.next_page_url}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
