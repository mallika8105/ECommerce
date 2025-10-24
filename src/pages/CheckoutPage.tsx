import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useCart } from '../context/CartContext'; // Import useCart
import './CheckoutPage.css'; // Import the custom CSS file

// The Product interface from CartContext is sufficient, no need for a separate CartItem here.

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCart(); // Use cartItems from CartContext
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

  const handlePlaceOrder = () => {
    console.log('Placing order with:', { shippingAddress, paymentMethod, cartItems, total });
    // Implement order placement logic
  };

  return (
    <div className="checkout-container">
      <main className="checkout-main">
        <h1 className="checkout-title">Checkout</h1>

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
                      <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))
                )}
                <div className="order-summary-divider"></div>
                <div className="order-summary-subtotal">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="order-summary-shipping">
                  <span>Shipping:</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="order-summary-total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button variant="primary" className="place-order-button" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
