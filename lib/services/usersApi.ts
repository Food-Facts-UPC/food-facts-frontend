import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiBase';

export interface User {
  id: number;
  username: string;
  roles: string[];
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
};
