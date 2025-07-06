"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Usar un ID de perfil hardcodeado por ahora, hasta que se implemente la autenticación y sesión.
        const hardcodedProfileId = "1"; 
        const data = await api.profiles.getById(hardcodedProfileId);
        setProfile(data);
      } catch (err) {
        setError("Failed to fetch profile details.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Cargando perfil...
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No se encontró el perfil.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Perfil de Usuario</CardTitle>
          <CardDescription>Información detallada de tu perfil.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p><strong>Nombre:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
          {profile.address && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Dirección:</h3>
              <p>{profile.address.street}</p>
              <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
              <p>{profile.address.country}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
