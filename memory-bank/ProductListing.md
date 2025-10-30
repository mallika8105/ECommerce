# `src/pages/ProductListing.tsx` Context File

## Purpose
This file defines the `ProductListing` component, which is responsible for displaying a list of products. It can filter products by category or subcategory, fetching data from Supabase. It also integrates with the cart context to allow users to add products to their shopping cart.

## Key Components/Functions
- **`Product` Interface:** Defines the structure of a product, including `id`, `name`, `price`, `image_url`, `description`, `size_chart`, and `color`.
- **`ProductListingProps` Interface:** Defines optional props `categoryId` and `subcategoryId` for filtering products.
- **`ProductListing` Component:**
    - Uses `useParams` to extract `categoryId` or `subcategoryId` from the URL, prioritizing props if provided.
    - Manages state for `products`, `loading`, and `error` using `useState`.
    - **`useEffect` Hook:**
        - Fetches products from the Supabase `products` table.
        - Applies filters based on `currentSubcategoryId` (higher priority) or `currentCategoryId`.
        - Handles loading and error states.
        - Assigns a placeholder image if `image_url` is missing for any product.
        - Re-runs when `currentCategoryId` or `currentSubcategoryId` changes.
    - Displays loading messages, error messages, or a "No products found" message based on the state.
    - Renders a grid of `Card` components, each representing a product.
    - Each product card includes a link to its details page, image, name, price, description, color, and size chart (if available).
    - Provides an "Add to Cart" button that uses the `addToCart` function from `useCart`.

## Dependencies
- `react`: Core React library (`useEffect`, `useState`).
- `react-router-dom`: For routing (`Link`, `useParams`).
- `../components/Card`: A reusable card component for displaying product information.
- `../components/Button`: A reusable button component for actions like "Add to Cart".
- `../context/CartContext`: Provides `addToCart` functionality via `useCart` hook.
- `../supabaseClient`: The initialized Supabase client for database interactions.
- `./ProductListing.css`: Custom CSS for styling the product listing page.
