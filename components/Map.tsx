
'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// Definimos un tipo para los datos de los restaurantes
export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  position: [number, number]; // Añadimos position para compatibilidad con el componente Map
}

interface MapProps {
  restaurants: Restaurant[];
}

const Map = ({ restaurants }: MapProps) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);

  useEffect(() => {
    // Este código se ejecuta solo en el lado del cliente
    const L = require('leaflet');
    const icon = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
    setCustomIcon(icon);
  }, []);

  if (!customIcon) {
    return null; // O un spinner de carga, mientras se crea el icono
  }

  // Mapear los restaurantes para añadir la propiedad 'position'
  const restaurantsWithPosition = restaurants.map(r => ({
    ...r,
    position: [r.latitude, r.longitude] as [number, number]
  }));

  return (
    <MapContainer center={[-12.046374, -77.042793]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {restaurantsWithPosition.map(restaurant => (
        <Marker key={restaurant.id} position={restaurant.position} icon={customIcon}>
          <Popup>
            <h3 className="font-bold">{restaurant.name}</h3>
            <p>{restaurant.address}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
