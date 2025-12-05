import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 500 ? 0 : 50.00; // Free shipping above ₹500
  const total = subtotal + shipping;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Save current page to return after login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch user's address from profile
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      
      setLoadingAddress(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', user.id)
          .maybeSingle();

        console.log('Profile data fetched:', data);
        console.log('Profile error:', error);

        if (error) {
          console.error('Supabase error:', error);
          // Don't throw - just use defaults
          setLoadingAddress(false);
          return;
        }

        if (data) {
          // Parse address if it's stored as JSON string
          let addressData = {};
          if (data.address) {
            if (typeof data.address === 'string') {
              const addressString = data.address.trim();
              
              // Check if the string looks like JSON (starts with { or [)
              if (addressString.startsWith('{') || addressString.startsWith('[') || 
                  (addressString.startsWith('"') && addressString.endsWith('"'))) {
                try {
                  // Handle potential double-encoded JSON
                  let jsonString = addressString;
                  
                  // Remove outer quotes if they exist (double-encoded case)
                  if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
                    jsonString = jsonString.slice(1, -1);
                    // Unescape any escaped quotes
                    jsonString = jsonString.replace(/\\"/g, '"');
                  }
                  
                  addressData = JSON.parse(jsonString);
                  console.log('Parsed address:', addressData);
                } catch (e) {
                  console.error('JSON parse error:', e);
                  console.error('Address value:', data.address);
                  // If parsing fails, treat as plain text address
                  addressData = { addressLine1: addressString };
                }
              } else {
                // If it doesn't look like JSON, treat it as plain text address
                console.log('Plain text address detected:', addressString);
                addressData = { addressLine1: addressString };
              }
            } else if (typeof data.address === 'object') {
              addressData = data.address;
            }
          }

          const newAddress = {
            fullName: data.full_name || '',
            phone: data.phone || '',
            addressLine1: (addressData as any)?.addressLine1 || '',
            addressLine2: (addressData as any)?.addressLine2 || '',
            city: (addressData as any)?.city || '',
            state: (addressData as any)?.state || '',
            zipCode: (addressData as any)?.zipCode || '',
            country: (addressData as any)?.country || '',
          };

          console.log('Setting address to:', newAddress);
          setShippingAddress(newAddress);
        }
      } catch (err) {
        console.error('Error fetching address:', err);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [user]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const validateAddress = () => {
    const required = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'country', 'phone'];
    for (const field of required) {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!validateAddress()) {
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setPlacingOrder(true);
    setError(null);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total: total,
            status: 'pending',
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
            shipping_address: JSON.stringify(shippingAddress),
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items - fetch fresh product data to ensure we have all required fields
      const orderItemsPromises = cartItems.map(async (item) => {
        // Fetch the latest product data to ensure we have product_name
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('name, product_code, image_url')
          .eq('id', item.id)
          .single();

        if (productError) {
          console.error('Error fetching product data for order item:', productError);
        }

        return {
          order_id: order.id,
          product_id: item.id,
          product_name: productData?.name || item.name || 'Unknown Product',
          product_code: productData?.product_code || item.product_code || 'N/A',
          product_image_url: productData?.image_url || item.image_url || '',
          quantity: item.quantity || 1,
          price: item.price,
          subtotal: item.price * (item.quantity || 1),
          size: item.size || null, // Include size if available
        };
      });

      const orderItems = await Promise.all(orderItemsPromises);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update user's address in profile if changed
      await supabase
        .from('profiles')
        .update({
          full_name: shippingAddress.fullName,
          phone: shippingAddress.phone,
          address: JSON.stringify({
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country,
          }),
        })
        .eq('id', user.id);

      // Clear cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading || loadingAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="checkout-container">
      <main className="checkout-main">
        <h1 className="checkout-title">Checkout</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="checkout-grid">
          {/* Shipping Address & Payment */}
          <div className="shipping-payment-section">
            <Card className="shipping-address-card">
              <h2 className="card-title">Shipping Address</h2>
              <form className="address-form">
                <Input
                  label="Full Name *"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
                <Input
                  label="Phone Number *"
                  name="phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
                <Input
                  label="Address Line 1 *"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleAddressChange}
                  className="text-sm"
                />
                <Input
                  label="City *"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
                <Input
                  label="State/Province *"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
                <Input
                  label="Zip/Postal Code *"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
                <Input
                  label="Country *"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  className="text-sm"
                  required
                />
              </form>
            </Card>

            <Card className="payment-method-card">
              <h2 className="card-title">Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <span className="ml-2">Cash on Delivery (COD)</span>
                </label>

                <label className="payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <span className="ml-2">Credit/Debit Card</span>
                </label>
                {paymentMethod === 'credit-card' && (
                  <div className="payment-card-details">
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      placeholder="**** **** **** ****"
                      className="text-sm"
                    />
                    <Input
                      label="Card Holder Name"
                      name="cardHolderName"
                      className="text-sm"
                    />
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      className="text-sm"
                    />
                    <Input
                      label="CVV"
                      name="cvv"
                      placeholder="***"
                      className="text-sm"
                      maxLength={3}
                    />
                  </div>
                )}

                <label className="payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <span className="ml-2">UPI</span>
                </label>
                {paymentMethod === 'upi' && (
                  <div className="payment-card-details">
                    <Input
                      label="UPI ID"
                      name="upiId"
                      placeholder="yourname@upi"
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="order-summary-card">
              <h2 className="card-title">Order Summary</h2>
              <div className="order-summary-details">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.size || index}`} className="order-item">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-md mr-2"
                      />
                      <div className="flex-1">
                        <span>{item.name} (x{item.quantity})</span>
                        {item.size && (
                          <span className="text-sm text-gray-600 ml-2">
                            - Size: {item.size}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
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
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    🎉 You got free shipping!
                  </p>
                )}
                {subtotal > 0 && subtotal < 500 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="order-summary-total">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="primary"
                className="place-order-button"
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
              {paymentMethod === 'cod' && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Pay when you receive your order
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
