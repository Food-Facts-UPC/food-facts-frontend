const API_BASE_URL = 'http://localhost:8080/api/v1';

export const getAuthHeaders = (): Record<string, string> => {
  // Verificar si estamos en el cliente antes de usar localStorage
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return {
          'Authorization': `Bearer ${userData.token}`,
        };
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }
  return {};
};

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Verificar si estamos en el cliente antes de usar localStorage
      if (typeof window !== 'undefined') {
        console.log('API: 401 error - clearing auth data');
        console.log('Current URL:', window.location.pathname);
        
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
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    } catch (e) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  return response.json();
};

export { API_BASE_URL };
