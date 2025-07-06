"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Settings, BarChart3, Plus, Eye, Package, Store } from "lucide-react";
import SimpleApiStatusCard from "@/components/SimpleApiStatusCard";

export default function DashboardPage() {
  const { user } = useAuth();

  // Si llegamos aquí, el middleware ya verificó que el usuario es admin
  // Solo necesitamos mostrar un loading si aún no se ha cargado el contexto
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
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
          {/* Gestión de Productos */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Package className="w-6 h-6 text-green-600" />
                Productos
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Gestiona la base de datos de productos alimentarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Link href="/dashboard/products" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Productos
                  </Button>
                </Link>
                <Link href="/dashboard/products/create">
                  <Button variant="outline" size="icon" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>• Añadir nuevos productos</p>
                <p>• Editar información nutricional</p>
                <p>• Gestionar categorías</p>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de Restaurantes */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Store className="w-6 h-6 text-green-600" />
                Restaurantes
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Administra los restaurantes y sus ubicaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Link href="/dashboard/restaurants" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Restaurantes
                  </Button>
                </Link>
                <Link href="/dashboard/restaurants/create">
                  <Button variant="outline" size="icon" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Plus className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>• Añadir nuevos restaurantes</p>
                <p>• Gestionar ubicaciones</p>
                <p>• Actualizar información</p>
              </div>
            </CardContent>
          </Card>

          {/* Usuarios */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Users className="w-6 h-6 text-green-600" />
                Usuarios
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Gestiona los usuarios registrados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/users">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Usuarios
                </Button>
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>• Ver usuarios activos</p>
                <p>• Gestionar permisos</p>
                <p>• Moderar contenido</p>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <BarChart3 className="w-6 h-6 text-green-600" />
                Estadísticas
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Visualiza el rendimiento de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/analytics">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Estadísticas
                </Button>
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>• Productos más buscados</p>
                <p>• Restaurantes populares</p>
                <p>• Actividad de usuarios</p>
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Settings className="w-6 h-6 text-green-600" />
                Configuración
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Ajusta la configuración general
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/settings">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </Button>
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>• Configuración general</p>
                <p>• Preferencias de la app</p>
                <p>• Configuración de API</p>
              </div>
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
            <Link href="/dashboard/products/create">
              <Button variant="outline" className="w-full h-12 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
            <Link href="/dashboard/restaurants/create">
              <Button variant="outline" className="w-full h-12 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Restaurante
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full h-12 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                <Users className="w-4 h-4 mr-2" />
                Gestionar Usuarios
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full h-12 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Reportes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
