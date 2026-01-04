import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layouts/navlayout";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AdminBookSearchPage from "@/pages/admin/booksearch";
import BooksPage from "@/pages/user/bookspage";
import FavoritesPage from "@/pages/user/favoritespage";
import ProtectedRoute from "./protectedroutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "books",
        element: (
          <ProtectedRoute>
            <BooksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/books",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminBookSearchPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
