
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { api } from '@/lib/services/api';
import { Restaurant } from '@/components/Map';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Extender la interfaz Restaurant para incluir latitude y longitude
interface RestaurantWithCoords extends Restaurant {
  latitude: number;
  longitude: number;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantWithCoords[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantsApi.getAll();
        setRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    { 
      loading: () => <p>Cargando mapa...</p>,
      ssr: false 
    }
  ), []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando restaurantes...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Food Facts
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">Restaurantes Saludables</h1>
        {isAdmin() && (
          <Link href="/restaurants/create">
            <Button>Crear Restaurante</Button>
          </Link>
        )}
      </header>
      <main className="p-4">
        <div className="h-[calc(100vh-100px)] w-full">
          <Map restaurants={restaurants} />
        </div>
      </main>
    </div>
  );
}
