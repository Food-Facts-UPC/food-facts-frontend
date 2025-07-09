import { API_BASE_URL, getAuthHeaders, handleResponse } from './apiBase';

interface ProductData {
  name: string;
  description?: string;
  price?: number;
  category?: string;
  [key: string]: unknown;
}

export const productsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  getByCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/code/${code}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  create: async (productData: ProductData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },
  update: async (id: string, productData: ProductData) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
};
