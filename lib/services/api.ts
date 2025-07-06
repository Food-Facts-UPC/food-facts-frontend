
const API_BASE_URL = 'http://localhost:8080/api/v1'; // Asume que el backend corre en el puerto 8080

export const api = {
  auth: {
    signIn: async (credentials: any) => {
      const response = await fetch(`${API_BASE_URL}/authentication/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Failed to sign in');
      }
      return response.json();
    },
    signUp: async (userData: any) => {
      const response = await fetch(`${API_BASE_URL}/authentication/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      return response.json();
    },
  },
  restaurants: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/restaurants`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant by ID');
      }
      return response.json();
    },
    getByTag: async (tagName: string) => {
      const response = await fetch(`${API_BASE_URL}/restaurants/tag/${tagName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants by tag');
      }
      return response.json();
    },
    create: async (restaurantData: any) => {
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      });
      if (!response.ok) {
        throw new Error('Failed to create restaurant');
      }
      return response.json();
    },
    addTag: async (restaurantId: string, tagData: any) => {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });
      if (!response.ok) {
        throw new Error('Failed to add tag to restaurant');
      }
      return response.json();
    },
  },
  profiles: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/profiles`);
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/profiles/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile by ID');
      }
      return response.json();
    },
    getByEmail: async (email: string) => {
      const response = await fetch(`${API_BASE_URL}/profiles/email/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile by email');
      }
      return response.json();
    },
    create: async (profileData: any) => {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to create profile');
      }
      return response.json();
    },
    addFavorite: async (profileId: string, restaurantId: string) => {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/favorites/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to add favorite restaurant');
      }
      return response.json();
    },
    removeFavorite: async (profileId: string, restaurantId: string) => {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/favorites/${restaurantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to remove favorite restaurant');
      }
      return response.json();
    },
  },
};
