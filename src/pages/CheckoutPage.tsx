import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient'; // Import supabase
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart(); // Use cartItems and clearCart from CartContext
  const { user, isAdmin } = useAuth(); // Get user and isAdmin from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = 10.00; // Placeholder
  const total = subtotal + shipping;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setError('You must be logged in to place an order.');
      return;
    }
    // Prevent mock admin from placing orders
    if (isAdmin) {
      setError('Orders cannot be placed with a mock admin account. Please log in as a regular user.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create the order record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          shipping_address: shippingAddress, // Store address as JSONB
          payment_method: paymentMethod,
          status: 'pending', // Initial status
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.id;

      // 2. Create order item records
      const orderItemsToInsert = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity || 1,
        price_at_purchase: item.price,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (orderItemsError) throw orderItemsError;

      // 3. Clear the cart
      clearCart();

      // 4. Redirect to order confirmation page
      navigate(`/order-confirmation/${orderId}`);

    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(`Failed to place order: ${err.message || 'An unexpected error occurred.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <main className="checkout-main">
        <h1 className="checkout-title">Checkout</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && <p className="text-blue-500 text-center mb-4">Placing order...</p>}

        <div className="checkout-grid">
          {/* Shipping Address & Payment */}
          <div className="shipping-payment-section">
            <Card className="shipping-address-card">
              <h2 className="card-title">Shipping Address</h2>
              <form className="address-form">
                <Input label="Full Name" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} className="text-sm" />
                <Input label="Address Line 1" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleAddressChange} className="text-sm" />
                <Input label="Address Line 2 (Optional)" name="addressLine2" value={shippingAddress.addressLine2} onChange={handleAddressChange} className="text-sm" />
                <Input label="City" name="city" value={shippingAddress.city} onChange={handleAddressChange} className="text-sm" />
                <Input label="State/Province" name="state" value={shippingAddress.state} onChange={handleAddressChange} className="text-sm" />
                <Input label="Zip/Postal Code" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} className="text-sm" />
                <Input label="Country" name="country" value={shippingAddress.country} onChange={handleAddressChange} className="text-sm" />
              </form>
            </Card>

            <Card className="payment-method-card">
              <h2 className="card-title">Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <span className="ml-2">Credit Card</span>
                </label>
                {paymentMethod === 'credit-card' && (
                  <div className="payment-card-details">
                    <Input label="Card Number" name="cardNumber" placeholder="**** **** **** ****" className="text-sm" />
                    <Input label="Card Holder Name" name="cardHolderName" className="text-sm" />
                    <Input label="Expiry Date" name="expiryDate" placeholder="MM/YY" className="text-sm" />
                    <Input label="CVV" name="cvv" placeholder="***" className="text-sm" />
                  </div>
                )}
                <label className="payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <span className="ml-2">PayPal</span>
                </label>
                <label className="payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <span className="ml-2">Bank Transfer</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="order-summary-card">
              <h2 className="card-title">Order Summary</h2>
              <div className="order-summary-details">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain rounded-md mr-2" /> {/* Changed to image_url */}
                      <span>{item.name} (x{item.quantity})</span>
                      <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))
                )}
                <div className="order-summary-divider"></div>
                <div className="order-summary-subtotal">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="order-summary-shipping">
                  <span>Shipping:</span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="order-summary-total">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <Button variant="primary" className="place-order-button" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
