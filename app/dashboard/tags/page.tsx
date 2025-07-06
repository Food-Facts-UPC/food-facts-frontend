"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Tag, Plus, Eye, Building, Hash, Store, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/services/api";

interface Tag {
  id: number;
  name: string;
  restaurantCount?: number;
}

export default function DashboardTagsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [tagRestaurants, setTagRestaurants] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    fetchTags();
  }, [user, isAdmin, router]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await api.tags.getAll();
      setTags(data);
    } catch (err) {
      setError("Error al cargar los tags");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRestaurants = async (tag: Tag) => {
    try {
      setLoadingRestaurants(true);
      setSelectedTag(tag);
      const restaurants = await api.tags.getRestaurantsByTag(tag.name);
      setTagRestaurants(restaurants);
    } catch (err) {
      setError("Error al cargar restaurantes del tag");
      console.error(err);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página
          </p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Tag className="w-8 h-8 text-green-600" />
            Gestión de Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra los tags (categorías) de los restaurantes
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tags List */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Lista de Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {tags.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No se encontraron tags
                    </p>
                  ) : (
                    tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tag.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {tag.restaurantCount || 0} restaurantes
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRestaurants(tag)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver restaurantes
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restaurants by Tag */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Restaurantes por Tag
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedTag ? (
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Selecciona un tag para ver sus restaurantes
                  </p>
                </div>
              ) : loadingRestaurants ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-green-600" />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Tag: {selectedTag.name}
                    </h3>
                  </div>
                  {tagRestaurants.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No se encontraron restaurantes para este tag
                    </p>
                  ) : (
                    tagRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {restaurant.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {restaurant.stars ? `${restaurant.stars} estrellas` : "Sin calificación"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {restaurant.tags?.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Tags
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tags.length}
                  </p>
                </div>
                <Tag className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tags Más Usado
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {tags.length > 0 
                      ? tags.reduce((prev, current) => 
                          (prev.restaurantCount || 0) > (current.restaurantCount || 0) ? prev : current
                        ).name
                      : "N/A"
                    }
                  </p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Promedio por Tag
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tags.length > 0 
                      ? Math.round(tags.reduce((sum, tag) => sum + (tag.restaurantCount || 0), 0) / tags.length)
                      : 0
                    }
                  </p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
