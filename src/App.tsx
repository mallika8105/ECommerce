import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import HomePage from './user/HomePage'; // Assuming HomePage.tsx is created
import ProductListPage from './user/components/ProductList'; // Assuming ProductListPage.tsx is created
import ProductDetailPage from './user/components/ProductDetail'; // Assuming ProductDetailPage.tsx is created
import Cart from './user/components/Cart'; // Existing Cart component
import Header from './user/components/Header'; // Assuming Header.tsx is created
import UserAccountPage from './user/components/UserAccount'; // Import UserAccountPage
import LoginPage from './user/LoginPage'; // Import LoginPage
import AdminDashboard from './admin/AdminDashboard'; // Import AdminDashboard
import './App.css';

// Placeholder for product data structure (should align with backend/Supabase schema)
interface Product {
  id: number;
  name: string;
  price: number;
  category: string; // Added category for filtering
  imageUrl: string; // Renamed from 'image' for clarity
  description: string;
}

// Cart item structure, extending Product with quantity
interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [session, setSession] = useState<any>(null); // State to hold user session

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        // Ensure data is in the expected Product format
        setProducts(data as Product[]);
      }
    };
    fetchProducts();

    // Set up Supabase auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Add to Cart handler
  const handleAddToCart = (productToAdd: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((item) =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If item is new, add it with quantity 1
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  // Remove from Cart handler
  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update quantity in Cart handler
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item // Ensure quantity is at least 1
      )
    );
  };

  // Placeholder for checkout logic
  const handleCheckout = () => {
    alert('Proceeding to checkout! (Checkout functionality not yet implemented)');
    // In a real app, this would navigate to a checkout page or trigger a modal
    // and potentially clear the cart after successful order placement.
  };

  return (
    <Router>
      <div className="App">
        <Header cartItemCount={cartItems.length} session={session} /> {/* Pass cart item count and session to Header */}
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<HomePage />} />

          {/* Product Listing Page Route */}
          <Route
            path="/products"
            element={<ProductListPage products={products} onAddToCart={handleAddToCart} />}
          />

          {/* Product Detail Page Route */}
          <Route
            path="/products/:id"
            element={<ProductDetailPage onAddToCart={handleAddToCart} />}
          />

          {/* Cart Page Route */}
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout} // Pass checkout handler
              />
            }
          />

          {/* User Account Page Route */}
          <Route path="/user-account" element={<UserAccountPage />} />

          {/* Login/Sign Up Page Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
