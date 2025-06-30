
'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

// Definimos un tipo para los datos de los restaurantes
export interface Restaurant {
  id: number;
  name: string;
  position: [number, number];
  address: string;
}

interface MapProps {
  restaurants: Restaurant[];
}

// Creamos un icono personalizado para los marcadores
const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Map = ({ restaurants }: MapProps) => {
  return (
    <MapContainer center={[-12.046374, -77.042793]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {restaurants.map(restaurant => (
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
