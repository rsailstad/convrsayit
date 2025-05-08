import * as SecureStore from 'expo-secure-store';

// Placeholder for API base URL, e.g., from environment variables
const API_BASE_URL = 'https://api.example.com';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Authentication request failed');
  }
  return response.json();
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    // Store token securely
    await SecureStore.setItemAsync('userToken', data.token);
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Login an existing user
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    // Store token securely
    await SecureStore.setItemAsync('userToken', data.token);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Logout the current user
export const logout = async () => {
  try {
    // Optionally call backend to invalidate token
    // await fetch(`${API_BASE_URL}/auth/logout`, { method: 'DELETE' });
    // Remove token from secure storage
    await SecureStore.deleteItemAsync('userToken');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// Get the stored token
export const getToken = async () => {
  return await SecureStore.getItemAsync('userToken');
}; 