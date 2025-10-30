# `src/pages/CheckoutPage.tsx` Context File

## Purpose
This file defines the `CheckoutPage` component, which guides the user through the process of finalizing their order. It collects shipping address details, allows selection of a payment method, and presents an order summary before placing the order. It integrates with the `CartContext` to display cart items and calculate totals.

## Key Components/Functions
- **`CheckoutPage` Component:** The main functional component for the checkout process.
- **`useCart` Hook:** Consumes the `CartContext` to access `cartItems`.
- **State Management:**
    - `shippingAddress`: An object storing various fields for the shipping address.
    - `paymentMethod`: A string indicating the selected payment method (e.g., 'credit-card', 'paypal').
- **Calculations:**
    - `subtotal`: Calculated by summing the price of all items in `cartItems`.
    - `shipping`: A placeholder value for shipping cost.
    - `total`: The sum of `subtotal` and `shipping`.
- **Event Handlers:**
    - `handleAddressChange`: Updates the `shippingAddress` state as the user types in address fields.
    - `handlePaymentMethodChange`: Updates the `paymentMethod` state based on radio button selection.
    - `handlePlaceOrder`: A placeholder function for the logic to finalize and place the order.
- **UI Sections:**
    - **Shipping Address Card:** A `Card` component containing a form with `Input` fields for full name, address lines, city, state, zip code, and country.
    - **Payment Method Card:** A `Card` component allowing users to select a payment method via radio buttons (Credit Card, PayPal, Bank Transfer). If "Credit Card" is selected, additional `Input` fields for card details are displayed.
    - **Order Summary Card:** A `Card` component displaying a list of items in the cart, subtotal, shipping cost, and the final total.
    - **Place Order Button:** A `Button` to trigger the `handlePlaceOrder` function.

## Dependencies
- `react`: Core React library (`useState`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component.
- `../context/CartContext`: Provides cart state via `useCart` hook.
- `./CheckoutPage.css`: Custom CSS for styling the checkout page.
