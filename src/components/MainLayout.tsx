import React from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
const MainLayout: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useCart();

  return (
    <>
      <Outlet /> {/* Renders the matched child route */}
      <CartDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </>
  );
};

export default MainLayout;
