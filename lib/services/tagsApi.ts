import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiBase';

export interface Tag {
  id: number;
  name: string;
  restaurantCount?: number;
}

interface RestaurantWithTags {
  tags?: string[];
  [key: string]: unknown;
}

export const tagsApi = {
  // Obtener todos los tags únicos desde los restaurantes
  getAll: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    const restaurants = await handleResponse(response);
    
    // Extraer tags únicos y contar cuántos restaurantes los usan
    const tagMap = new Map<string, number>();
    restaurants.forEach((restaurant: RestaurantWithTags) => {
      if (restaurant.tags) {
        restaurant.tags.forEach((tagName: string) => {
          tagMap.set(tagName, (tagMap.get(tagName) || 0) + 1);
        });
      }
    });
    
    // Convertir a array de objetos Tag
    return Array.from(tagMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      restaurantCount: count,
    }));
  },
  
  // Obtener restaurantes por tag
  getRestaurantsByTag: async (tagName: string) => {
    const response = await fetch(`${API_BASE_URL}/restaurants/tag/${tagName}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  
  // Agregar tag a restaurante
  addToRestaurant: async (restaurantId: number, tagName: string) => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ tagName }),
    });
    return handleResponse(response);
  },
};
