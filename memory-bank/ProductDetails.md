# `src/pages/ProductDetails.tsx` Context File (Updated)

## Purpose
This file defines the `ProductDetails` component, which displays comprehensive information about a single product. It fetches product data from Supabase based on the `productId` from the URL, handles image selection, quantity input, size selection, and integrates with the cart functionality. It also shows customer reviews and related products. The data fetching logic has been made more robust to handle cases where a product might not be found.

## Key Components/Functions
- **`Product` Interface:** Defines the structure of a product, including `id`, `name`, `description`, `price`, `image_url`, `additional_images`, `rating`, `category_id`, `colors`, `size_chart_url`, and `available_sizes`.
- **`Review` Interface:** Defines the structure of a customer review, including `id`, `author`, `rating`, and `comment`.
- **`ProductDetails` Component:**
    - Uses `useParams` to get the `productId` from the URL.
    - Manages state for `product`, `loading`, `error`, `mainImage` (for gallery), `quantity`, `selectedSize`, `reviews`, and `relatedProducts` using `useState`.
    - **`useEffect` Hook:**
        - Triggers `fetchProductDetails` when the `productId` changes.
        - **`fetchProductDetails` Function:**
            - Asynchronously fetches product details from the Supabase `products` table using the `productId`.
            - **Updated Logic:** Removed the `.single()` method from the Supabase query. Instead, it now checks if `data` exists and `data.length > 0` to ensure a product was found. If found, it uses `data[0]` to populate the product state.
            - Initializes `mainImage` with the product's primary image and `selectedSize` with the first available size.
            - Fetches placeholder reviews and related products.
            - Handles loading and error states. If no product is found, `setError('Product not found.')` is called.
    - **`handleQuantityChange` Function:** Updates the `quantity` state.
    - **`handleAddToCart` Function:** Adds the current product with the selected quantity to the cart.
    - **`handleBuyNow` Function:** Adds the current product to the cart and navigates to the checkout page.
    - **UI Sections:**
        - **Product Image Gallery:** Displays the main product image and thumbnails.
        - **Product Info & Description:** Shows product name, price, and description.
        - **Product Details Section:** Displays colors, sizes, and size chart link.
        - **Action Buttons:** Quantity input, "Add to Cart", and "Buy Now" buttons.
        - **Reviews Section:** Displays customer reviews.
        - **Related Products Section:** Shows a grid of related products.

## Dependencies
- `react`: Core React library (`useEffect`, `useState`).
- `react-router-dom`: For routing (`useParams`, `Link`, `useNavigate`).
- `lucide-react`: Icon library (`Star`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component (used for reviews and related products).
- `../supabaseClient`: The initialized Supabase client for database interactions.
- `../context/CartContext`: Provides `addToCart` functionality via `useCart` hook.
- `./ProductDetails.css`: Custom CSS for styling the product details page.
