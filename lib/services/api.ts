import { authApi } from './authApi';
import { restaurantsApi } from './restaurantsApi';
import { profilesApi } from './profilesApi';
import { productsApi } from './productsApi';
import { usersApi } from './usersApi';
import { tagsApi } from './tagsApi';

export const api = {
  auth: authApi,
  restaurants: restaurantsApi,
  profiles: profilesApi,
  products: productsApi,
  users: usersApi,
  tags: tagsApi,
};