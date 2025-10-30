# `src/context/CartContext.tsx` Context File

## Purpose
This file establishes a React Context for managing the shopping cart state across the application. It provides functionalities to add, remove, and update product quantities in the cart, as well as control the visibility of a cart drawer.

## Key Components/Functions
- **`Product` Interface:** Defines the structure of a product item, including `id`, `name`, `price`, `image_url`, and an optional `quantity`.
- **`CartContextType` Interface:** Specifies the shape of the cart context, including `cartItems`, `addToCart`, `removeFromCart`, `updateQuantity`, `isDrawerOpen`, and `toggleDrawer`.
- **`CartContext`:** The React context object created using `createContext`.
- **`CartProvider` Component:**
    - Manages the state for `cartItems` (an array of `Product` objects) and `isDrawerOpen` using `useState`.
    - **`addToCart` Function:** Adds a product to the cart. If the product already exists, its quantity is incremented; otherwise, it's added as a new item with a quantity of 1. It also automatically opens the cart drawer.
    - **`toggleDrawer` Function:** Toggles the `isDrawerOpen` state, controlling the visibility of the cart drawer.
    - **`removeFromCart` Function:** Removes a product from the cart based on its `productId`.
    - **`updateQuantity` Function:** Updates the quantity of a specific product in the cart.
    - Provides the `CartContextType` values to its children via `CartContext.Provider`.
- **`useCart` Hook:** A custom hook that simplifies consuming the `CartContext`, ensuring it's used within a `CartProvider`.

## Dependencies
- `react`: Core React library (`createContext`, `useContext`, `useState`, `ReactNode`).
