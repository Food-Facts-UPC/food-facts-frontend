"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Store, Plus, MapPin, Star, Tag, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/services/api";

interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  stars: number;
  tags: string[];
}

export default function DashboardRestaurantsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    fetchRestaurants();
  }, [user, isAdmin, router]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await api.restaurants.getAll();
      setRestaurants(data);
    } catch (err) {
      setError("Error al cargar los restaurantes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!selectedRestaurant || !newTagName.trim()) return;

    try {
      setAddingTag(true);
      await api.restaurants.addTag(selectedRestaurant.id.toString(), { tagName: newTagName.trim() });
      await fetchRestaurants(); // Refresh the list
      setNewTagName("");
      setShowAddTagModal(false);
      setSelectedRestaurant(null);
    } catch (err) {
      setError("Error al agregar el tag");
      console.error(err);
    } finally {
      setAddingTag(false);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Store className="w-8 h-8 text-green-600" />
                Gestión de Restaurantes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Administra los restaurantes y sus ubicaciones
              </p>
            </div>
            <Link href="/dashboard/restaurants/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Restaurante
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Restaurants List */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Lista de Restaurantes ({restaurants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {restaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron restaurantes</p>
                    <Link href="/dashboard/restaurants/create" className="mt-4 inline-block">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Crear Primer Restaurante
                      </Button>
                    </Link>
                  </div>
                ) : (
                  restaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Store className="w-5 h-5 text-green-600" />
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {restaurant.name}
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {restaurant.latitude.toFixed(6)}, {restaurant.longitude.toFixed(6)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {restaurant.stars ? `${restaurant.stars} estrellas` : "Sin calificación"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                              {restaurant.tags && restaurant.tags.length > 0 ? (
                                restaurant.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-xs">Sin tags</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRestaurant(restaurant);
                              setShowAddTagModal(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Tag className="w-4 h-4" />
                            Agregar Tag
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Restaurantes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {restaurants.length}
                  </p>
                </div>
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Con Calificación
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {restaurants.filter(r => r.stars > 0).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Promedio Estrellas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {restaurants.length > 0 
                      ? (restaurants.reduce((sum, r) => sum + (r.stars || 0), 0) / restaurants.length).toFixed(1)
                      : "0.0"
                    }
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Tag Modal */}
        {showAddTagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Agregar Tag a {selectedRestaurant?.name}
              </h3>
              <div className="mb-4">
                <label htmlFor="tagName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Tag
                </label>
                <input
                  id="tagName"
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Vegano, Saludable, etc."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddTagModal(false);
                    setSelectedRestaurant(null);
                    setNewTagName("");
                  }}
                  disabled={addingTag}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddTag}
                  disabled={addingTag || !newTagName.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {addingTag ? "Agregando..." : "Agregar Tag"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
