"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleApiStatusCard from "@/components/SimpleApiStatusCard";
import { 
  Store, 
  Users, 
  BarChart3, 
  Plus,
  ArrowRight,
  Tag,
  User
} from "lucide-react";
import { api } from "@/lib/services/api";

interface DashboardStats {
  totalRestaurants: number;
  totalUsers: number;
  totalTags: number;
  totalProfiles: number;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalRestaurants: 0,
    totalUsers: 0,
    totalTags: 0,
    totalProfiles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Dashboard: authLoading", authLoading);
    console.log("Dashboard: user", user);
    if (authLoading) return;
    if (!user) {
      console.log("Dashboard: No user, redirecting to /login");
      router.push("/login");
      return;
    }
    fetchDashboardStats();
  }, [user, router, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Obtener datos de manera paralela
      const [restaurants, users, tags, profiles] = await Promise.all([
        api.restaurants.getAll(),
        api.users.getAll(),
        api.tags.getAll(),
        api.profiles.getAll(),
      ]);

      setStats({
        totalRestaurants: restaurants.length,
        totalUsers: users.length,
        totalTags: tags.length,
        totalProfiles: profiles.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirigiendo a login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenido, {user.username}. Gestiona tu aplicación Food Facts.
          </p>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Gestión de Tags */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Tag className="w-5 h-5" />
                Gestión de Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : stats.totalTags}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tags totales
                </span>
              </div>
              <Link href="/dashboard/tags" className="block">
                <Button variant="outline" className="w-full justify-between">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gestión de Restaurantes */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Store className="w-5 h-5" />
                Gestión de Restaurantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : stats.totalRestaurants}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Restaurantes totales
                </span>
              </div>
              <Link href="/dashboard/restaurants" className="block">
                <Button variant="outline" className="w-full justify-between">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gestión de Usuarios */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Users className="w-5 h-5" />
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : stats.totalUsers}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Usuarios totales
                </span>
              </div>
              <Link href="/dashboard/users" className="block">
                <Button variant="outline" className="w-full justify-between">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gestión de Perfiles */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <User className="w-5 h-5" />
                Gestión de Perfiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : stats.totalProfiles}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Perfiles totales
                </span>
              </div>
              <Link href="/dashboard/profiles" className="block">
                <Button variant="outline" className="w-full justify-between">
                  Ver todos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <BarChart3 className="w-5 h-5" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sistema</span>
                  <span className="text-green-600 font-medium">Activo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Última actualización</span>
                  <span className="text-gray-500">Ahora</span>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-between">
                Ver detalles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Estado de la API */}
          <SimpleApiStatusCard />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/restaurants/create">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Restaurante
              </Button>
            </Link>
            <Link href="/dashboard/tags">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Tag className="w-4 h-4 mr-2" />
                Gestionar Tags
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                Ver Usuarios
              </Button>
            </Link>
            <Link href="/dashboard/profiles">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <User className="w-4 h-4 mr-2" />
                Ver Perfiles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
