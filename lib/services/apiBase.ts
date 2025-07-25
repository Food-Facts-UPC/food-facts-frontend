const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAuthHeaders = (): Record<string, string> => {
  // Verificar si estamos en el cliente antes de usar localStorage
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Compatibilidad con distintos nombres de campo para el token
        const rawToken: string | undefined =
          userData.token || userData.accessToken || userData.jwt || userData.jwtToken;

        if (rawToken) {
          // Evitar duplicar el prefijo "Bearer " si el token ya lo incluye
          const preparedToken = rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken;
          return {
            Authorization: `Bearer ${preparedToken}`,
          };
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }
  return {};
};

export const handleResponse = async (response: Response) => {
  console.log('API Response:', response.status, response.url);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Verificar si estamos en el cliente antes de usar localStorage
      if (typeof window !== 'undefined') {
        console.log('API: 401 error - clearing auth data');
        console.log('Current URL:', window.location.pathname);
        console.log('Request URL:', response.url);
        
        localStorage.removeItem('user');
        // Eliminar cookie también
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        
        // Disparar evento personalizado para que el AuthContext se actualice
        window.dispatchEvent(new Event('auth-logout'));
        
        // Evitar redirección automática si ya estamos en login
        if (!window.location.pathname.includes('/login')) {
          console.log('API: Redirecting to login in 100ms');
          // Usar una pequeña demora para permitir que el contexto se actualice
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        } else {
          console.log('API: Already on login page, skipping redirect');
        }
      }
      throw new Error('Session expired. Please login again.');
    }
    try {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch (e) {
      console.error('API Error (no JSON):', e);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  return response.json();
};

export { API_BASE_URL };
