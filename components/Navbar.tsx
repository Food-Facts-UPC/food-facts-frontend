"use client";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, MapPin, User, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Food Facts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-accent/50">
                <Search className="w-4 h-4" />
                Buscar
              </Button>
            </Link>
            <Link href="/restaurants">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-accent/50">
                <MapPin className="w-4 h-4" />
                Restaurantes
              </Button>
            </Link>
            
            {user ? (
              <>
                {isAdmin() && (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-accent/50">
                      <Settings className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-accent/50">
                    <User className="w-4 h-4" />
                    Perfil
                  </Button>
                </Link>
                <Link href="/profile/favorites">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-accent/50">
                    <Heart className="w-4 h-4" />
                    Favoritos
                  </Button>
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                  <span className="text-sm text-muted-foreground">
                    {user.username}
                  </span>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="ml-2">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-2">
              <Link href="/search">
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsMenuOpen(false)}>
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
              </Link>
              <Link href="/restaurants">
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsMenuOpen(false)}>
                  <MapPin className="w-4 h-4" />
                  Restaurantes
                </Button>
              </Link>
              
              {user ? (
                <>
                  {isAdmin() && (
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4" />
                      Perfil
                    </Button>
                  </Link>
                  <Link href="/profile/favorites">
                    <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => setIsMenuOpen(false)}>
                      <Heart className="w-4 h-4" />
                      Favoritos
                    </Button>
                  </Link>
                  <div className="pt-2 border-t border-border/40">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Conectado como: {user.username}
                    </div>
                    <Button 
                      onClick={handleLogout} 
                      variant="ghost" 
                      className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-border/40 space-y-2">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700" onClick={() => setIsMenuOpen(false)}>
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}