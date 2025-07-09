
'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { api } from '@/lib/services/api';
import { Restaurant as RestaurantType } from '@/types';
import { Heart, Star, MapPin, Eye } from 'lucide-react';

// Extendemos la interfaz para incluir la posición
export interface Restaurant extends RestaurantType {
  position: [number, number]; // Añadimos position para compatibilidad con el componente Map
}

interface MapProps {
  restaurants: Restaurant[];
}

const Map = ({ restaurants }: MapProps) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<number[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Este código se ejecuta solo en el lado del cliente
    import('leaflet').then((L) => {
      // Crear un icono personalizado más atractivo
      const icon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      setCustomIcon(icon);
    });
  }, []);

  const fetchUserFavorites = useCallback(async () => {
    if (!user) return;
    
    try {
      const profile = await api.profiles.getMe();
      // El backend devuelve favoriteRestaurantIds como Set<Long>, no como array de objetos
      const favoriteIds = profile.favoriteRestaurantIds || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      // Si hay error de autenticación, limpiar favoritos
      if (error instanceof Error && error.message.includes('Session expired')) {
        setFavorites([]);
      }
    }
  }, [user]);

  useEffect(() => {
    // Cargar favoritos del usuario si está autenticado
    if (user) {
      fetchUserFavorites();
    } else {
      // Limpiar favoritos si no hay usuario
      setFavorites([]);
    }
  }, [user, fetchUserFavorites]);

  const handleToggleFavorite = async (restaurantId: number) => {
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Debes iniciar sesión para añadir favoritos'
      });
      return;
    }

    if (loadingFavorites.includes(restaurantId)) return;

    setLoadingFavorites(prev => [...prev, restaurantId]);
    
    try {
      const isFavorite = favorites.includes(restaurantId);
      
      if (isFavorite) {
        await api.profiles.removeFavorite(restaurantId.toString());
        setFavorites(prev => prev.filter(id => id !== restaurantId));
        addNotification({
          type: 'success',
          title: 'Restaurante eliminado de favoritos'
        });
      } else {
        await api.profiles.addFavorite(restaurantId.toString());
        setFavorites(prev => [...prev, restaurantId]);
        addNotification({
          type: 'success',
          title: 'Restaurante añadido a favoritos'
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Verificar si es un error de autenticación
      if (error instanceof Error && error.message.includes('Session expired')) {
        addNotification({
          type: 'warning',
          title: 'Tu sesión ha expirado. Iniciando sesión nuevamente...'
        });
        // No redirigir aquí, el apiBase ya se encarga de eso
      } else {
        addNotification({
          type: 'error',
          title: 'Error al actualizar favoritos'
        });
      }
    } finally {
      setLoadingFavorites(prev => prev.filter(id => id !== restaurantId));
    }
  };

  const handleViewDetails = (restaurantId: number) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  if (!customIcon) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>;
  }

  // Mapear los restaurantes para añadir la propiedad 'position'
  const restaurantsWithPosition = restaurants.map(r => ({
    ...r,
    position: [r.latitude, r.longitude] as [number, number]
  }));

  return (
    <div className="h-full w-full">
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-popup .leaflet-popup-close-button {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          color: #6b7280;
          top: 8px;
          right: 8px;
        }
        .custom-popup .leaflet-popup-close-button:hover {
          background: rgba(255, 255, 255, 1);
          color: #374151;
        }
      `}</style>
      <MapContainer center={[-12.046374, -77.042793]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {restaurantsWithPosition.map(restaurant => (
          <Marker key={restaurant.id} position={restaurant.position} icon={customIcon}>
            <Popup className="custom-popup">
              <div className="p-4 min-w-[320px] max-w-[400px]">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{restaurant.name}</h3>
                  {restaurant.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="leading-relaxed">{restaurant.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>ID: {restaurant.id}</span>
                    <span>•</span>
                    <span>{restaurant.latitude.toFixed(4)}, {restaurant.longitude.toFixed(4)}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= restaurant.stars
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{restaurant.stars}</span>
                  <span className="text-xs text-gray-500">
                    {restaurant.stars === 1 ? "estrella" : "estrellas"}
                  </span>
                </div>

                {/* Tags */}
                {restaurant.tags && restaurant.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Categorías:</h4>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {restaurant.tags.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          +{restaurant.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(restaurant.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                  </button>
                  {user && (
                    <button
                      onClick={() => handleToggleFavorite(restaurant.id)}
                      disabled={loadingFavorites.includes(restaurant.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        favorites.includes(restaurant.id)
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {loadingFavorites.includes(restaurant.id) ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className={`w-4 h-4 ${favorites.includes(restaurant.id) ? 'fill-current' : ''}`} />
                      )}
                      {favorites.includes(restaurant.id) ? 'Favorito' : 'Like'}
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
