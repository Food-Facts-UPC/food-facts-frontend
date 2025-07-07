"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { profilesApi } from '@/lib/services/profilesApi';
import { restaurantsApi } from '@/lib/services/restaurantsApi';
import { Profile, Restaurant } from '@/types';
import { ArrowLeft, MapPin, Mail, User, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProfileWithDetails extends Profile {
  fullName: string;
  favoriteRestaurantIds: number[];
}

export default function ProfileDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap the params promise
    params.then(({ id }) => {
      setProfileId(id);
    });
  }, [params]);

  const fetchProfile = useCallback(async () => {
    if (!profileId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profile data
      const profileData = await profilesApi.getById(profileId);
      setProfile(profileData);

      // Fetch favorite restaurants if any
      if (profileData.favoriteRestaurantIds && profileData.favoriteRestaurantIds.length > 0) {
        const allRestaurants = await restaurantsApi.getAll();
        const favorites = allRestaurants.filter((restaurant: Restaurant) => 
          profileData.favoriteRestaurantIds.includes(restaurant.id)
        );
        setFavoriteRestaurants(favorites);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    if (profileId) {
      fetchProfile();
    }
  }, [user, isAdmin, router, profileId, fetchProfile]);

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
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">Error al cargar el perfil</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{error}</p>
              </div>
              <Link href="/dashboard/profiles">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Perfiles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                Perfil no encontrado
              </p>
              <Link href="/dashboard/profiles">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Perfiles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/profiles" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Perfiles
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Perfil de Usuario
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Información detallada del perfil
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre Completo
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {profile.fullName || `${profile.firstName} ${profile.lastName}`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ID de Usuario
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      #{profile.userId}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Correo Electrónico
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Dirección
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {profile.streetAddress}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Stats */}
          <div className="space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {profile.favoriteRestaurantIds?.length || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Restaurantes Favoritos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Favorite Restaurants */}
        {favoriteRestaurants.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Restaurantes Favoritos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{restaurant.stars}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {restaurant.latitude.toFixed(4)}, {restaurant.longitude.toFixed(4)}
                        </span>
                      </div>

                      {restaurant.tags && restaurant.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {restaurant.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
