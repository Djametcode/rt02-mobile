import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://online-marketplace02.vercel.app/api';
const FRONTEND_URL = 'https://online-marketplace02-bwri.vercel.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to resolve image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  // Backend stores path like "/uploads/dispenser.jpg" but uploads are on frontend
  return `${FRONTEND_URL}${imageUrl}`;
};

export default api;
