import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiBase';

interface RestaurantData {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  stars?: number;
  [key: string]: unknown;
}

interface TagData {
  name: string;
  [key: string]: unknown;
}

export const restaurantsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getByTag: async (tagName: string) => {
    const response = await fetch(`${API_BASE_URL}/restaurants/tag/${tagName}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  create: async (restaurantData: RestaurantData) => {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(restaurantData),
    });
    return handleResponse(response);
  },
  addTag: async (restaurantId: string, tagData: TagData) => {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(tagData),
    });
    return handleResponse(response);
  },
};
