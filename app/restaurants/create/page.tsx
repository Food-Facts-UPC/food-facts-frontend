"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { restaurantsApi } from "@/lib/services/restaurantsApi";
import LocationPickerMap from "@/components/LocationPickerMap";

export default function CreateRestaurantPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login"); // Redirigir si no está autenticado o no es admin
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user || !isAdmin()) {
      setError("You are not authorized to create a restaurant.");
      return;
    }

    try {
      const newRestaurant = {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      await restaurantsApi.create(newRestaurant);
      setSuccess("Restaurant created successfully!");
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      router.push("/restaurants"); // Redirigir a la lista de restaurantes
    } catch (err) {
      setError("Failed to create restaurant. Please check your input.");
      console.error("Create restaurant error:", err);
    }
  };

  if (!user || !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirigiendo...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Nuevo Restaurante</CardTitle>
          <CardDescription>
            Introduce los detalles del nuevo restaurante.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nombre del Restaurante"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                type="text"
                placeholder="Dirección del Restaurante"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="-12.1234"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-77.5678"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>

            {/* Mapa para seleccionar ubicación */}
            <div className="mt-4">
              <Label className="flex items-center gap-2 mb-2">
                Selecciona la ubicación en el mapa (clic para fijar marcador)
              </Label>
              <LocationPickerMap
                latitude={parseFloat(latitude) || 0}
                longitude={parseFloat(longitude) || 0}
                onSelect={(lat, lng) => {
                  setLatitude(lat.toString());
                  setLongitude(lng.toString());
                }}
                height={300}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
            <Button type="submit" className="w-full mt-6">
              Crear Restaurante
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
