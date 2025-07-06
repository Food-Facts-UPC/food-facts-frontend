"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/components/Map";
import { api } from "@/lib/services/api";
import { profilesApi } from "@/lib/services/profilesApi";

export default function FavoriteRestaurantsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [availableRestaurants, setAvailableRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const fetchProfileAndRestaurants = async () => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const profileData = await api.profiles.getMe();
      setProfile(profileData);

      const allRestaurants = await api.restaurants.getAll();

      // Filtrar los restaurantes favoritos del perfil
      const favRestaurantIds = profileData.favoriteRestaurants.map((fav: any) => fav.restaurantId);
      const currentFavorites = allRestaurants.filter((r: Restaurant) => favRestaurantIds.includes(r.id));
      setFavoriteRestaurants(currentFavorites);

      // Filtrar los restaurantes disponibles (no favoritos)
      const currentAvailable = allRestaurants.filter((r: Restaurant) => !favRestaurantIds.includes(r.id));
      setAvailableRestaurants(currentAvailable);

    } catch (err) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRestaurants();
  }, [user, authLoading]); // Depend on user and authLoading

  const handleAddFavorite = async (restaurantId: string) => {
    if (!user) return; // Should not happen if redirected
    try {
      await api.profiles.addFavorite(restaurantId); // Call without profileId
      await fetchProfileAndRestaurants(); // Refrescar la lista
    } catch (err) {
      setError("Failed to add favorite.");
      console.error("Error adding favorite:", err);
    }
  };

  const handleRemoveFavorite = async (restaurantId: string) => {
    if (!user) return; // Should not happen if redirected
    try {
      await profilesApi.removeFavorite(restaurantId); // Call without profileId
      await fetchProfileAndRestaurants(); // Refrescar la lista
    } catch (err) {
      setError("Failed to remove favorite.");
      console.error("Error removing favorite:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando autenticación...
      </div>
    );
  }

  if (!user) {
    return null; // Should redirect by useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando favoritos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Mis Restaurantes Favoritos</CardTitle>
          <CardDescription>Gestiona tus restaurantes favoritos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <h3 className="text-lg font-semibold">Favoritos Actuales:</h3>
          {favoriteRestaurants.length === 0 ? (
            <p>No tienes restaurantes favoritos aún.</p>
          ) : (
            <ul className="grid gap-2">
              {favoriteRestaurants.map((restaurant) => (
                <li key={restaurant.id} className="flex justify-between items-center border p-2 rounded-md">
                  <span>{restaurant.name}</span>
                  <Button variant="destructive" onClick={() => handleRemoveFavorite(restaurant.id.toString())}>
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-lg font-semibold mt-6">Añadir Nuevos Favoritos:</h3>
          {availableRestaurants.length === 0 ? (
            <p>No hay más restaurantes disponibles para añadir a favoritos.</p>
          ) : (
            <ul className="grid gap-2">
              {availableRestaurants.map((restaurant) => (
                <li key={restaurant.id} className="flex justify-between items-center border p-2 rounded-md">
                  <span>{restaurant.name}</span>
                  <Button onClick={() => handleAddFavorite(restaurant.id.toString())}>
                    Añadir
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
