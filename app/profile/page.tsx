"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, MapPin } from "lucide-react";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  number: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth(); // Destructure isLoading
  const router = useRouter();

  useEffect(() => {
    // If authentication is still loading, do nothing
    if (authLoading) {
      return;
    }

    // If user is not logged in, redirect to login page
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true); // Set loading true when fetching starts
      try {
        // Ensure user.id is a string for the API call
        const data = await api.profiles.getById();
        setProfile(data);
      } catch (err: any) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          // Profile not found, redirect to create profile page
          router.push("/profile/create");
        } else {
          setError("Failed to fetch profile details.");
          console.error("Error fetching profile:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router, authLoading]); // Add authLoading to dependencies

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
        Redirigiendo para crear perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <User className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Información de tu cuenta
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              Información Personal
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Detalles de tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Completo
                </Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>

            {(profile.street || profile.city || profile.country) && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Dirección
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {(profile.street || profile.number) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Dirección
                      </Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {profile.street} {profile.number}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.city && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ciudad
                      </Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {profile.city}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.postalCode && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Código Postal
                      </Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {profile.postalCode}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.country && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        País
                      </Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white">
                          {profile.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}