"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onSelect: (lat: number, lng: number) => void;
  height?: string | number; // e.g. 400 or "400px" or "100%"
}

const LocationPickerMap = ({ latitude, longitude, onSelect, height = 400 }: LocationPickerMapProps) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(
    latitude !== 0 || longitude !== 0 ? [latitude, longitude] : null
  );

  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setCustomIcon(icon);
    });
  }, []);

  // Sincronizar cambios externos en lat/lng con el marcador interno
  useEffect(() => {
    if (latitude !== 0 || longitude !== 0) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onSelect(lat, lng);
        setPosition([lat, lng]);
      },
    });
    return null;
  };

  // Default center: Lima, Perú
  const center: [number, number] = position ?? [-12.046374, -77.042793];

  if (!customIcon) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <MapClickHandler />
        {position && <Marker position={position} icon={customIcon} />}
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap; 