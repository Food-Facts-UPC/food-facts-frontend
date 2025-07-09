import { API_BASE_URL, handleResponse } from './apiBase';

interface SignInCredentials {
  username: string;
  password: string;
}

interface SignUpData {
  username: string;
  password: string;
  email?: string;
}

export const authApi = {
  signIn: async (credentials: SignInCredentials) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/authentication/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },
  signUp: async (userData: SignUpData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/authentication/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};
