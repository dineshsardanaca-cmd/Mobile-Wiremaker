
'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { CartItem, MenuItem, ModificationOption } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity: number, selectedModifications: ModificationOption[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'menuMorphCartItems';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on initial client-side render
  useEffect(() => {
    try {
      const localData = window.localStorage.getItem(CART_STORAGE_KEY);
      if (localData) {
        setCartItems(JSON.parse(localData));
      }
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving cart to localStorage", error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item: MenuItem, quantity: number, selectedModifications: ModificationOption[]) => {
    // Prevent adding the same coupon multiple times
    if (item.type === 'coupon' && cartItems.some(cartItem => cartItem.item.id === item.id)) {
        toast({
            variant: "destructive",
            title: "Deal Already Added",
            description: `${item.name} is already in your cart.`,
        });
        return;
    }


    const modificationPrice = selectedModifications.reduce((sum, mod) => sum + mod.price, 0);
    const lineItemPrice = (item.price + modificationPrice) * quantity;
    
    const newCartItem: CartItem = {
      id: `${item.id}-${Date.now()}`, // Simple unique ID
      item,
      quantity: item.type === 'coupon' ? 1 : quantity, // Coupons always have quantity 1
      selectedModifications,
      lineItemPrice,
    };

    setCartItems(prevItems => [...prevItems, newCartItem]);
    toast({
        title: item.type === 'coupon' ? "Deal Added" : "Added to Cart",
        description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(cartItem => {
        if (cartItem.id === cartItemId) {
          if (newQuantity <= 0) {
            return null; // Will be filtered out
          }
           // Coupons cannot have their quantity changed
          if (cartItem.item.type === 'coupon') {
            return cartItem;
          }
          const modificationPrice = cartItem.selectedModifications.reduce((sum, mod) => sum + mod.price, 0);
          return {
            ...cartItem,
            quantity: newQuantity,
            lineItemPrice: (cartItem.item.price + modificationPrice) * newQuantity,
          };
        }
        return cartItem;
      }).filter(Boolean) as CartItem[]
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  }

  const totalItems = useMemo(() => {
    if (!isLoaded) return 0;
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems, isLoaded]);

  const totalPrice = useMemo(() => {
    if (!isLoaded) return 0;
    return cartItems.reduce((sum, item) => sum + item.lineItemPrice, 0);
  }, [cartItems, isLoaded]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
