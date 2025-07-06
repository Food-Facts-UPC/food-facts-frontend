"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";

export default function DashboardRestaurantsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin()) {
      router.push("/");
      return;
    }
  }, [user, isAdmin, router]);

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
            <Store className="w-8 h-8 text-green-600" />
            Gestión de Restaurantes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra los restaurantes y sus ubicaciones
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <div className="text-center">
            <Store className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Gestión de Restaurantes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta sección estará disponible próximamente. Aquí podrás gestionar todos los restaurantes.
            </p>
            <Link href="/dashboard/restaurants/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Crear Nuevo Restaurante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
