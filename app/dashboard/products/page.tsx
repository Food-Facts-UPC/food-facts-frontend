"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/services/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  code: string;
  category: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function DashboardProductsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
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

    fetchProducts();
  }, [user, isAdmin, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await api.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
      console.error('Error deleting product:', err);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Package className="w-8 h-8 text-green-600" />
                Gestión de Productos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Administra los productos alimentarios en la base de datos
              </p>
            </div>
            <Link href="/dashboard/products/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <Package className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Error al cargar productos</h3>
                <p className="text-sm">{error}</p>
              </div>
              <Button onClick={fetchProducts} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay productos registrados
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comienza agregando tu primer producto a la base de datos
              </p>
              <Link href="/dashboard/products/create">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Producto
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Productos ({products.length})
                </h2>
                <Button onClick={fetchProducts} variant="outline" size="sm">
                  Actualizar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {product.name}
                      </CardTitle>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Marca:</strong> {product.brand}</p>
                        <p><strong>Código:</strong> {product.code}</p>
                        <p><strong>Categoría:</strong> {product.category}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {product.nutritionalInfo && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                          <p className="font-medium mb-2">Información Nutricional:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <span>Calorías: {product.nutritionalInfo.calories}</span>
                            <span>Proteínas: {product.nutritionalInfo.protein}g</span>
                            <span>Carbohidratos: {product.nutritionalInfo.carbs}g</span>
                            <span>Grasas: {product.nutritionalInfo.fat}g</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Link href={`/product/${product.code}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
