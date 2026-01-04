import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Heart, LogOut, Search } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/books" className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl">BookFinder</span>
            </Link>

            <div className="flex space-x-4">
              <Link to="/books">
                <Button variant={isActive("/books") ? "default" : "ghost"} className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Books</span>
                </Button>
              </Link>

              <Link to="/favorites">
                <Button variant={isActive("/favorites") ? "default" : "ghost"} className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Favorites</span>
                </Button>
              </Link>

              {isAdmin && (
                <Link to="/admin/books">
                  <Button variant={isActive("/admin/books") ? "default" : "ghost"} className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search Books</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email || "User"}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
