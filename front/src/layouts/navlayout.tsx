import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <Outlet />
    </div>
  );
}
