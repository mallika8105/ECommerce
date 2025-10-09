import React from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckout: () => void; // Added onCheckout prop
}

const Cart: React.FC<CartProps> = ({ cartItems, onRemoveFromCart, onUpdateQuantity, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={onCheckout}>Checkout</button> {/* Added onClick handler */}
        </>
      )}
    </div>
  );
};

export default Cart;
>>>>
<task_progress>
- [x] Analyze Requirements
- [x] Project Setup and Structure: Confirm the use of the existing `Ecommerce` project as the base.
- [x] Project Setup and Structure: Create a dedicated directory structure for the admin dashboard (e.g., `src/admin`).
- [x] User-Facing Website Implementation: Implement Homepage (Hero banner, featured products, categories, offers).
- [x] User-Facing Website Implementation: Create HomePage.tsx and HomePage.css
- [x] User-Facing Website Implementation: Implement Product Listing Page (Filters, sorting, pagination).
- [x] User-Facing Website Implementation: Implement Product Detail Page (Photos, description, add-to-cart, reviews).
- [x] User-Facing Website Implementation: Install `react-router-dom` for routing.
- [x] User-Facing Website Implementation: Integrate routing and components into `App.tsx`.
- [x] User-Facing Website Implementation: Update `ProductListPage.tsx` to accept props and handle product data correctly.
- [x] User-Facing Website Implementation: Update `ProductDetailPage.tsx` to accept `onAddToCart` prop.
- [x] User-Facing Website Implementation: Update `Cart.tsx` to accept `onCheckout` prop and implement checkout button functionality.
- [ ] User-Facing Website Implementation: Implement User Account features (Order history, addresses, wishlist).
- [ ] User-Facing Website Implementation: Implement Search Bar with suggestions.
- [ ] User-Facing Website Implementation: Implement Reviews & Ratings functionality.
- [ ] User-Facing Website Implementation: Implement Customer Support (Contact form/chatbot).
- [ ] User-Facing Website Implementation: Ensure Responsive Design.
- [ ] User-Facing Website Implementation: Implement Authentication (Sign up, login using Supabase/Firebase Auth).
- [ ] Admin Dashboard Implementation
- [ ] Styling
- [ ] API Integration (Frontend)
- [ ] Development Server Setup
- [ ] Testing
- [ ] Deployment Preparation
</task_progress>
