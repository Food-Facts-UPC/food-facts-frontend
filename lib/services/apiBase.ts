const API_BASE_URL = 'http://localhost:8080/api/v1';

export const getAuthHeaders = (): Record<string, string> => {
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
  return {};
};

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
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
