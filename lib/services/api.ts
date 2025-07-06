import { authApi } from './authApi';
import { restaurantsApi } from './restaurantsApi';
import { profilesApi } from './profilesApi';
import { productsApi } from './productsApi';

export const api = {
  auth: authApi,
  restaurants: restaurantsApi,
  profiles: profilesApi,
  products: productsApi,
};