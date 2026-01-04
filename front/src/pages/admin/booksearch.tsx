import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Book {
  title: string;
  authors: string[];
  isbn: string;
  cover_url: string | null;
}

interface ApiResponse {
  status: string;
  books: Book[];
}

export default function AdminBookSearchPage() {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [savingBooks, setSavingBooks] = useState<Set<string>>(new Set());
  const [savedBooks, setSavedBooks] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setSavedBooks(new Set()); // Reset saved books on new search

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getbooks?query=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data: ApiResponse = await response.json();
      setBooks(data.books || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (book: Book) => {
    setSavingBooks((prev) => new Set(prev).add(book.isbn));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/savebook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: book.title,
          author: book.authors,
          isbn: book.isbn,
          cover_url: book.cover_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save book");
      }

      setSavedBooks((prev) => new Set(prev).add(book.isbn));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save book");
    } finally {
      setSavingBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(book.isbn);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Book Search</h1>
          <p className="text-gray-600">Search for books using Google Books API</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Books</CardTitle>
            <CardDescription>Enter a book title, author, or ISBN to search</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for books..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-32" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && searched && books.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No books found. Try a different search query.</p>
            </CardContent>
          </Card>
        )}

        {!loading && books.length > 0 && (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">Found {books.length} books</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        {book.cover_url ? (
                          <img src={book.cover_url} alt={book.title} className="w-24 h-32 object-cover rounded" />
                        ) : (
                          <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Cover</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                        {book.authors && book.authors.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">by {book.authors.join(", ")}</p>
                        )}
                        <Badge variant="secondary" className="text-xs mb-3">
                          ISBN: {book.isbn}
                        </Badge>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleSaveBook(book)}
                            disabled={savingBooks.has(book.isbn) || savedBooks.has(book.isbn)}
                            className="w-full"
                          >
                            {savedBooks.has(book.isbn) ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                {savingBooks.has(book.isbn) ? "Saving..." : "Add Book"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
