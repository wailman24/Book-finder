/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  cover_url: string | null;
}

interface ApiResponse {
  status: string;
  favorites: Book[];
}

export default function FavoritesPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingBooks, setRemovingBooks] = useState<Set<number>>(new Set());

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/listfavorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const data: ApiResponse = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (bookId: number) => {
    setRemovingBooks((prev) => new Set(prev).add(bookId));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/togglefavorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (!response.ok) throw new Error("Failed to remove favorite");

      setFavorites((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove from favorites");
    } finally {
      setRemovingBooks((prev) => {
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
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-gray-600">Your collection of favorite books</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg mb-2">No favorites yet</p>
              <p className="text-gray-400 text-sm">Start adding books to your favorites!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((book) => (
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
                      variant="default"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveFavorite(book.id)}
                      disabled={removingBooks.has(book.id)}
                    >
                      <Heart className="w-4 h-4 fill-current" />
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
        )}
      </div>
    </div>
  );
}
