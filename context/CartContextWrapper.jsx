"use client";
import React from 'react';
import { useAuth } from './AuthContext';
import { CartProvider } from './CartContext';

export const CartProviderWrapper = ({ children }) => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;
  return <CartProvider userId={userId}>{children}</CartProvider>;
};
