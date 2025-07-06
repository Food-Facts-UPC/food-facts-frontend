"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  Heart, 
  Phone,
  Loader2, 
  AlertCircle,
  Eye,
  Users
} from "lucide-react";
import { api } from "@/lib/services/api";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  userId: number;
  favoriteRestaurants: any[];
}

export default function DashboardProfilesPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }

    fetchProfiles();
  }, [user, isAdmin, router]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.profiles.getAll();
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los perfiles');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <User className="w-8 h-8 text-orange-600" />
            Gestión de Perfiles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra los perfiles de usuarios y su información personal
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Cargando perfiles...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Error al cargar los perfiles
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <Button onClick={fetchProfiles} className="bg-orange-600 hover:bg-orange-700">
                Intentar de nuevo
              </Button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay perfiles disponibles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Los perfiles aparecerán aquí cuando los usuarios completen su información
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Perfiles de Usuario ({profiles.length})
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    {profiles.reduce((sum, p) => sum + (p.favoriteRestaurants?.length || 0), 0)} favoritos
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <Card key={profile.id} className="border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <User className="w-5 h-5 text-orange-600" />
                        {profile.firstName} {profile.lastName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400 truncate">
                            {profile.email}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {profile.phone || 'No especificado'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400 truncate">
                            {profile.streetAddress || 'No especificado'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {profile.favoriteRestaurants?.length || 0} favoritos
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {profile.userId}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => router.push(`/dashboard/profiles/${profile.id}`)}
                      >
                        Ver detalles
                        <Eye className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
