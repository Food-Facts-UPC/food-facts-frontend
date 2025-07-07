"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/services/api";
import { Restaurant } from "@/types";
import { ArrowLeft, MapPin, Star, Heart, Tag, Loader2 } from "lucide-react";

export default function RestaurantDetailsPage({ params }: { params: Promise<{ code: string }> }) {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    // Unwrap the params promise
    params.then(({ code }) => {
      setRestaurantId(code);
    });
  }, [params]);

  useEffect(() => {
    if (!restaurantId) return;
    
    const fetchRestaurantDetails = async () => {
      try {
        const data = await api.restaurants.getById(restaurantId);
        setRestaurant(data);
        
        // Verificar si es favorito del usuario
        if (user) {
          const profile = await api.profiles.getMe();
          // El backend devuelve favoriteRestaurantIds como Set<Long>, no como array de objetos
          const favoriteIds = profile.favoriteRestaurantIds || [];
          setIsFavorite(favoriteIds.includes(data.id));
        }
      } catch (err) {
        setError("Error al cargar los detalles del restaurante");
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Debes iniciar sesión para añadir favoritos'
      });
      return;
    }

    if (!restaurant) return;

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.profiles.removeFavorite(restaurant.id.toString());
        setIsFavorite(false);
        addNotification({
          type: 'success',
          title: 'Restaurante eliminado de favoritos'
        });
      } else {
        await api.profiles.addFavorite(restaurant.id.toString());
        setIsFavorite(true);
        addNotification({
          type: 'success',
          title: 'Restaurante añadido a favoritos'
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      addNotification({
        type: 'error',
        title: 'Error al actualizar favoritos'
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Cargando detalles del restaurante...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/restaurants')}>
            Volver a Restaurantes
          </Button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurante no encontrado</h1>
          <p className="text-gray-600 mb-4">El restaurante que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push('/restaurants')}>
            Volver a Restaurantes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/restaurants')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Restaurantes
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>
                  {restaurant.latitude.toFixed(4)}, {restaurant.longitude.toFixed(4)}
                </span>
              </div>
            </div>
            
            {user && (
              <Button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                variant={isFavorite ? "default" : "outline"}
                className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
              >
                {favoriteLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                )}
                {isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
              </Button>
            )}
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info Card */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Información del Restaurante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= restaurant.stars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {restaurant.stars} estrellas
                </span>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Categorías
                </h3>
                {restaurant.tags && restaurant.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No hay categorías disponibles
                  </p>
                )}
              </div>

              {/* Coordinates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Latitud:</strong> {restaurant.latitude}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Longitud:</strong> {restaurant.longitude}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Ubicación en el Mapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.longitude - 0.01},${restaurant.latitude - 0.01},${restaurant.longitude + 0.01},${restaurant.latitude + 0.01}&layer=mapnik&marker=${restaurant.latitude},${restaurant.longitude}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title={`Mapa de ${restaurant.name}`}
                />
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${restaurant.latitude}&mlon=${restaurant.longitude}#map=16/${restaurant.latitude}/${restaurant.longitude}`, '_blank')}
                  className="w-full"
                  variant="outline"
                >
                  Ver en OpenStreetMap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}