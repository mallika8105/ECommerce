# `src/pages/CartPage.tsx` Context File

## Purpose
This file defines the `CartPage` component, which displays the user's shopping cart contents. It allows users to view items, adjust quantities, remove items, and proceed to checkout. It integrates with the `CartContext` for managing cart state.

## Key Components/Functions
- **`CartPage` Component:** The main functional component for the shopping cart page.
- **`useCart` Hook:** Consumes the `CartContext` to access `cartItems`, `removeFromCart`, and `updateQuantity` functions.
- **`calculateTotal` Function:** Calculates the total price of all items currently in the cart.
- **Conditional Rendering:**
    - If `cartItems` is empty, it displays a message "Your cart is empty" and a link to "Start Shopping".
    - If `cartItems` contains products, it renders a detailed view of the cart.
- **Cart Item Display:**
    - Iterates through `cartItems` to display each product with its image, name, price, and current quantity.
    - Provides buttons to increment or decrement item quantities, disabling the decrement button if the quantity is 1.
    - Includes a "Remove" button with a `Trash2` icon to remove items from the cart.
- **Order Summary:**
    - Displays a summary of the order, including subtotal, shipping (currently "Free"), and total.
    - Provides a "Proceed to Checkout" button that links to the `/checkout` page.

## Dependencies
- `react`: Core React library.
- `react-router-dom`: For navigation (`Link`).
- `lucide-react`: Icon library (`Trash2`).
- `../components/Button`: Reusable button component.
- `../context/CartContext`: Provides cart state and functions via `useCart` hook.
