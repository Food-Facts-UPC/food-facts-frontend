"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Tag, ArrowRight } from "lucide-react";

export default function DashboardProductsPage() {
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

    // Redirigir automáticamente a la página de tags después de un breve momento
    const timer = setTimeout(() => {
      router.push("/dashboard/tags");
    }, 3000);

    return () => clearTimeout(timer);
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
            <Package className="w-8 h-8 text-green-600" />
            Gestión de Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Redirigiendo a la gestión de tags...
          </p>
        </div>

        {/* Redirect Notice */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Redirigiendo a Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mb-6">
                <Package className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <Tag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Gestión de Productos → Tags
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                La gestión de productos ahora se maneja a través de los tags de los restaurantes.
                Serás redirigido automáticamente en unos momentos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/tags">
                  <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Ir a Tags Ahora
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  ¿Qué son los Productos?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                En nuestro sistema, los &quot;productos&quot; se refieren a las categorías y tipos de comida 
                que ofrecen los restaurantes, los cuales se gestionan a través de los tags.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  ¿Cómo funcionan los Tags?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Los tags permiten categorizar restaurantes por tipo de comida (vegano, italiano, saludable, etc.), 
                facilitando la búsqueda y filtrado de opciones.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Auto-redirect countdown */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">
              Redirigiendo automáticamente a la gestión de tags...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
