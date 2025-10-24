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
