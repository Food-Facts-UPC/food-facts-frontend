"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { api } from "@/lib/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, MapPin, Star, Loader2, AlertCircle, TrendingUp } from "lucide-react";

// Definir interfaz específica para la página de búsqueda
interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  stars: number;
  tags: string[];
}

export default function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  const initialQuery = resolvedSearchParams.query || '';
  const [query, setQuery] = useState(initialQuery);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setRestaurants([]);

    if (!query.trim()) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.restaurants.getByTag(query.trim());
      setRestaurants(data);
    } catch (err) {
      setError("No se pudieron buscar restaurantes con esa etiqueta.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la búsqueda inicial si hay un query en los parámetros de la URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      // Ejecutar búsqueda automáticamente
      const searchAutomatically = async () => {
        setError(null);
        setLoading(true);
        setRestaurants([]);

        try {
          const data = await api.restaurants.getByTag(initialQuery);
          setRestaurants(data);
        } catch (err) {
          setError("No se pudieron buscar restaurantes con esa etiqueta.");
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      };
      
      searchAutomatically();
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600/10 to-cyan-600/10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Descubre restaurantes saludables
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-800 to-cyan-800 dark:from-white dark:via-emerald-200 dark:to-cyan-200 bg-clip-text text-transparent">
              Busca Restaurantes
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Encuentra restaurantes con opciones saludables cerca de ti usando etiquetas específicas
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
              <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busca restaurantes por etiqueta (ej. 'vegetariano', 'sin gluten')"
                    className="w-full pl-12 pr-4 py-5 text-lg text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 border-0"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="px-8 py-5 rounded-none bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {['vegetariano', 'vegano', 'sin gluten', 'orgánico', 'saludable'].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(tag)}
                  className="rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-600"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200">Error en la búsqueda</h3>
                      <p className="text-red-600 dark:text-red-300">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {query && restaurants.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Resultados para &quot;{query}&quot;
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Se encontraron {restaurants.length} restaurantes
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map((restaurant, index) => (
                  <div 
                    key={restaurant.id} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link href={`/product/${restaurant.id}`}>
                      <Card className="group hover-lift overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                                {restaurant.name}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span>{restaurant.stars}/5</span>
                                </div>
                              </CardDescription>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {restaurant.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {restaurant.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                  +{restaurant.tags.length - 3}
                                </span>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <div>Lat: {restaurant.latitude.toFixed(4)}</div>
                              <div>Lng: {restaurant.longitude.toFixed(4)}</div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <Button variant="outline" className="w-full group/btn">
                            <MapPin className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                            Ver Detalles
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && !loading && restaurants.length === 0 && !error && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No se encontraron restaurantes
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  No se encontraron restaurantes para &quot;{query}&quot;. 
                  Intenta con otra etiqueta o verifica la ortografía.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['vegetariano', 'vegano', 'sin gluten'].map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      onClick={() => setQuery(tag)}
                      className="rounded-full"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!query && !loading && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Realiza una búsqueda
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Introduce una etiqueta en la barra de búsqueda para empezar a descubrir restaurantes saludables.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}