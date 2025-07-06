
const API_BASE_URL = 'http://localhost:8080/api/v1'; // Asume que el backend corre en el puerto 8080

// Función para obtener headers de autenticación
const getAuthHeaders = (): Record<string, string> => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return {
        'Authorization': `Bearer ${userData.token}`,
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return {};
};

// Función para manejar respuestas y errores de autenticación
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    // Intentar obtener el mensaje de error del servidor
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch (e) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  return response.json();
};

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
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant by ID');
      }
      return response.json();
    },
    getByTag: async (tagName: string) => {
      const response = await fetch(`${API_BASE_URL}/restaurants/tag/${tagName}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
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
          ...getAuthHeaders(),
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
          ...getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      return response.json();
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
          ...getAuthHeaders(),
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
          ...getAuthHeaders(),
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
  products: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch product by ID');
      }
      return response.json();
    },
    getByCode: async (code: string) => {
      const response = await fetch(`${API_BASE_URL}/products/code/${code}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch product by code');
      }
      return response.json();
    },
    create: async (productData: any) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      return response.json();
    },
    update: async (id: string, productData: any) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      return response.json();
    },
  },
  // Función de utilidad para debug
  debug: {
    testAuth: async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          console.error('No user found in localStorage');
          return false;
        }
        
        const userData = JSON.parse(user);
        console.log('User data:', userData);
        
        // Test with a simple API call
        const response = await fetch(`${API_BASE_URL}/profiles`, {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        });
        
        console.log('API Response Status:', response.status);
        console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Response Data:', data);
          return true;
        } else {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          return false;
        }
      } catch (error) {
        console.error('Debug test failed:', error);
        return false;
      }
    },
  },
};
