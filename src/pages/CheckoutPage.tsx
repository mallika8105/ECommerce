import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const cartItems: CartItem[] = [
  { id: '1', name: 'Premium Wireless Headphones', price: 199.99, quantity: 1 },
  { id: '2', name: 'Bluetooth Speaker', price: 89.99, quantity: 2 },
];

const CheckoutPage: React.FC = () => {
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address & Payment */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} />
                <Input label="Address Line 1" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleAddressChange} />
                <Input label="Address Line 2 (Optional)" name="addressLine2" value={shippingAddress.addressLine2} onChange={handleAddressChange} />
                <Input label="City" name="city" value={shippingAddress.city} onChange={handleAddressChange} />
                <Input label="State/Province" name="state" value={shippingAddress.state} onChange={handleAddressChange} />
                <Input label="Zip/Postal Code" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} />
                <Input label="Country" name="country" value={shippingAddress.country} onChange={handleAddressChange} />
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Credit Card</span>
                </label>
                {paymentMethod === 'credit-card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                    <Input label="Card Number" placeholder="**** **** **** ****" />
                    <Input label="Card Holder Name" />
                    <Input label="Expiry Date" placeholder="MM/YY" />
                    <Input label="CVV" placeholder="***" />
                  </div>
                )}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">PayPal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={handlePaymentMethodChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Bank Transfer</span>
                </label>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="font-semibold text-gray-800">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-gray-800">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button variant="primary" className="w-full" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
