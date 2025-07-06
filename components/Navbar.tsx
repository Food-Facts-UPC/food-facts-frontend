"use client";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="font-bold text-lg">
        Food Facts
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/search" className="text-sm font-medium hover:underline underline-offset-4">
          Search
        </Link>
        <Link href="/restaurants" className="text-sm font-medium hover:underline underline-offset-4">
          Restaurants
        </Link>
        {user ? (
          <>
            <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
              Profile
            </Link>
            <Link href="/profile/favorites" className="text-sm font-medium hover:underline underline-offset-4">
              Favorites
            </Link>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
            <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
              Register
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}