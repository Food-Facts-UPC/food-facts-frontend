import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiBase';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  [key: string]: unknown;
}

export const profilesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/profiles/me`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getByEmail: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/profiles/email/${email}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  create: async (profileData: ProfileData) => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
  addFavorite: async (restaurantId: string) => {
    const response = await fetch(`${API_BASE_URL}/profiles/me/favorites/${restaurantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  removeFavorite: async (restaurantId: string) => {
    const response = await fetch(`${API_BASE_URL}/profiles/me/favorites/${restaurantId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
};
