import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string; // Changed to match database column name
  product_code?: string; // Add product_code for order items
  quantity?: number; // Made quantity optional
  size?: string; // Add size for products with size options
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  clearCart: () => void; // Add clearCart to the interface
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addToCart = (productToAdd: Product) => {
    setCartItems((prevItems) => {
      // Check if item with same id AND size exists (if size is provided)
      const existingItem = prevItems.find((item) => 
        item.id === productToAdd.id && 
        (productToAdd.size ? item.size === productToAdd.size : !item.size)
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id && 
          (productToAdd.size ? item.size === productToAdd.size : !item.size)
            ? { ...item, quantity: (item.quantity || 0) + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
    setIsDrawerOpen(true); // Open drawer when item is added
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => {
        if (size !== undefined) {
          return !(item.id === productId && item.size === size);
        }
        return item.id !== productId;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (size !== undefined) {
          return (item.id === productId && item.size === size) ? { ...item, quantity } : item;
        }
        return item.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => { // Implement clearCart function
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, isDrawerOpen, toggleDrawer, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
