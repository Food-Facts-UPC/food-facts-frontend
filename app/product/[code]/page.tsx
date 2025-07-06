"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/services/api";
import { Restaurant } from "@/components/Map"; // Reutilizamos la interfaz Restaurant

// Extender la interfaz Restaurant para incluir latitude y longitude
interface RestaurantDetails extends Restaurant {
  latitude: number;
  longitude: number;
}

export default function RestaurantDetailsPage({ params }: { params: { code: string } }) {
  const restaurantId = params.code; // Asumimos que 'code' es el ID del restaurante
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const data = await restaurantsApi.getById(restaurantId);
        setRestaurant(data);
      } catch (err) {
        setError("Failed to fetch restaurant details.");
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantDetails();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Cargando detalles del restaurante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error: {error}</h1>
          <Link href="/restaurants" className="text-green-600 hover:underline mt-4 block">
            Volver a la lista de restaurantes
          </Link>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Restaurante no encontrado</h1>
          <Link href="/restaurants" className="text-green-600 hover:underline mt-4 block">
            Volver a la lista de restaurantes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Food Facts
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
          <p className="text-gray-700 mb-2"><strong>Dirección:</strong> {restaurant.address}</p>
          {/* Aquí puedes añadir más detalles del restaurante si la interfaz Restaurant los incluye */}
          {/* Por ejemplo, si tu backend devuelve tags, podrías mostrarlos aquí */}
          {/* {restaurant.tags && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Etiquetas:</h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.tags.map((tag, index) => (
                  <span key={index} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )} */}
          <div className="mt-6">
            <Link href="/restaurants" className="text-green-600 hover:underline">
              Volver a la lista de restaurantes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}