"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Store, Plus, MapPin, Star } from "lucide-react";
import { api } from "@/lib/services/api";
import dynamic from "next/dynamic";

// Cargar el mapa solo en el cliente para evitar errores de "window is not defined" durante el build
const LocationPickerMap = dynamic(() => import("@/components/LocationPickerMap"), { ssr: false });

interface RestaurantFormData {
  name: string;
  latitude: number;
  longitude: number;
  stars: number;
}

export default function CreateRestaurantPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: "",
    latitude: 0,
    longitude: 0,
    stars: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("El nombre del restaurante es requerido");
      return;
    }

    if (formData.stars < 1 || formData.stars > 5) {
      setError("Las estrellas deben estar entre 1 y 5");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await api.restaurants.create({
        name: formData.name.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        stars: formData.stars,
      });

      router.push("/dashboard/restaurants");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el restaurante");
      console.error("Error creating restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RestaurantFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
          <Link href="/dashboard/restaurants" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Restaurantes
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Plus className="w-8 h-8 text-green-600" />
            Crear Restaurante
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Agrega un nuevo restaurante al sistema
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Información del Restaurante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Restaurante</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Restaurante La Bella Vista"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Coordenadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Latitud
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="Ej: -12.0464"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Longitud
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="Ej: -77.0428"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              {/* Mapa para seleccionar ubicación */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  Selecciona la ubicación en el mapa (clic para fijar marcador)
                </Label>
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onSelect={(lat, lng) => {
                    handleInputChange("latitude", lat);
                    handleInputChange("longitude", lng);
                  }}
                  height={300}
                />
              </div>

              {/* Estrellas */}
              <div className="space-y-2">
                <Label htmlFor="stars" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Calificación (1-5 estrellas)
                </Label>
                <Input
                  id="stars"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.stars}
                  onChange={(e) => handleInputChange("stars", parseInt(e.target.value) || 5)}
                  required
                />
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= formData.stars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {formData.stars} estrella{formData.stars !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/restaurants")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Restaurante
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm max-w-2xl mx-auto mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Ayuda para Coordenadas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Puedes obtener las coordenadas de Google Maps:
                </p>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>1. Busca el restaurante en Google Maps</li>
                  <li>2. Haz clic derecho en la ubicación exacta</li>
                  <li>3. Selecciona el primer número para la latitud</li>
                  <li>4. Selecciona el segundo número para la longitud</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
