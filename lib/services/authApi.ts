import { API_BASE_URL, handleResponse } from './apiBase';

export const authApi = {
  signIn: async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/authentication/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
  signUp: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/authentication/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};
