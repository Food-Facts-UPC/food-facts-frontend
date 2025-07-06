"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/services/api";
import { Restaurant } from "@/components/Map"; // Reutilizamos la interfaz Restaurant
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage({ searchParams }: { searchParams: { query: string } }) {
  const initialQuery = searchParams.query || '';
  const [query, setQuery] = useState(initialQuery);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setRestaurants([]);

    if (!query) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.restaurants.getByTag(query);
      setRestaurants(data);
    } catch (err) {
      setError("Failed to search restaurants by tag.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la búsqueda inicial si hay un query en los parámetros de la URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch({ preventDefault: () => {} } as React.FormEvent); // Simular evento para ejecutar la búsqueda
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      <header className="bg-white shadow-lg p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-green-600">
            Food Facts
          </Link>
          {/* Formulario de Búsqueda en el Header */}
          <div className="w-full max-w-md">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-gray-100 rounded-full shadow-inner">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca restaurantes por etiqueta..."
                  className="w-full px-6 py-3 text-lg text-gray-700 bg-transparent rounded-full focus:outline-none"
                />
                <Button
                  type="submit"
                  className="px-6 py-3 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none transition-colors duration-300"
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

        {query && restaurants.length > 0 && (
          <div>
            <h1 className="text-4xl font-bold mb-8">Resultados para "{query}"</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {restaurants.map((restaurant) => (
                <Link key={restaurant.id} href={`/product/${restaurant.id}`}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group">
                    <div className="p-5">
                      <h3 className="font-bold text-xl truncate group-hover:text-green-600 transition-colors duration-300">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">{restaurant.address}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {query && !loading && restaurants.length === 0 && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">No se encontraron restaurantes para "{query}"</h1>
            <p className="text-xl text-gray-600">Intenta con otra etiqueta o verifica la ortografía.</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Realiza una búsqueda</h1>
            <p className="text-xl text-gray-600">Introduce una etiqueta en la barra de búsqueda para empezar.</p>
          </div>
        )}
      </main>
    </div>
  );
}