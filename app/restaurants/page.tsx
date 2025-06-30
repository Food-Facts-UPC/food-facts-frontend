
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Restaurant } from '@/components/Map';

// Datos de ejemplo para los restaurantes
const restaurants: Restaurant[] = [
  { id: 1, name: 'Restaurante Vegano GreenLeaf', position: [40.416775, -3.703790], address: 'Calle de la Montera, 32, Madrid' },
  { id: 2, name: 'Sabor Fresco & Natural', position: [41.385063, 2.173404], address: 'Plaça de Catalunya, 1, Barcelona' },
  { id: 3, name: 'El Rincón Saludable', position: [39.470242, -0.376800], address: 'Carrer de Colón, 60, Valencia' },
];

export default function RestaurantsPage() {
  // Usamos dynamic import para el mapa, deshabilitando el SSR
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'), // Creamos un componente separado para el mapa
    { 
      loading: () => <p>Cargando mapa...</p>,
      ssr: false 
    }
  ), []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Food Facts
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">Restaurantes Saludables</h1>
      </header>
      <main className="p-4">
        <div className="h-[calc(100vh-100px)] w-full">
          <Map restaurants={restaurants} />
        </div>
      </main>
    </div>
  );
}
