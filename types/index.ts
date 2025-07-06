// Restaurant types
export interface Restaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  stars: number;
  tags: string[];
  address?: string; // Dirección opcional
}

export interface CreateRestaurantData {
  name: string;
  latitude: number;
  longitude: number;
  stars: number;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
  restaurantCount?: number;
}

// User types
export interface User {
  id: number;
  username: string;
  roles: string[];
}

// Profile types
export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  userId: number;
  favoriteRestaurants: Restaurant[];
}

export interface CreateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Dashboard stats types
export interface DashboardStats {
  totalRestaurants: number;
  totalUsers: number;
  totalTags: number;
  totalProfiles: number;
}
