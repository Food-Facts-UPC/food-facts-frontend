
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Restaurant } from '@/components/Map';

// Datos de ejemplo para los restaurantes
const restaurants: Restaurant[] = [
  { id: 1, name: 'La Nevera Fit', position: [-12.1195, -77.0342], address: 'Calle General Recavarren 435, Miraflores' },
  { id: 2, name: 'Armónica Café', position: [-12.1225, -77.0307], address: 'Av. Mariscal La Mar 1167, Miraflores' },
  { id: 3, name: 'Limaná', position: [-12.1088, -77.0335], address: 'Av. Augusto Pérez Araníbar 2011, San Isidro' },
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
