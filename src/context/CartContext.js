import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  };

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCartItems(data.items || []);
    } catch (err) {
      // No cart yet
      setCartItems([]);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { success: false, message: 'Login dulu untuk menambahkan ke keranjang' };
      }
      const { data } = await api.post('/cart', { productId, quantity: 1 });
      setCartItems(data.items || []);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Gagal menambahkan' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  const login = async (token, userData) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    await fetchCart();
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setCartItems([]);
    setUser(null);
  };

  return (
    <CartContext.Provider value={{
      cartItems, setCartItems, addToCart, removeFromCart, clearCart,
      fetchCart, user, login, logout
    }}>
      {children}
    </CartContext.Provider>
  );
};
