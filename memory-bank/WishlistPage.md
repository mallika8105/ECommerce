# `src/pages/WishlistPage.tsx` Context File

## Purpose
This file defines the `WishlistPage` component, which allows authenticated users to view and manage their saved wishlist items. Users can remove items from the wishlist or add them to the shopping cart.

## Key Components/Functions
- **`WishlistItem` Interface:** Defines the structure of a product item in the wishlist, including `id`, `name`, `price`, and `imageUrl`.
- **`sampleWishlist` Array:** A hardcoded array of sample wishlist items for demonstration purposes.
- **`WishlistPage` Component:** The main functional component for the user's wishlist page.
- **State Management:**
    - `wishlist`: Stores the list of `WishlistItem` objects (currently initialized with `sampleWishlist`).
- **Event Handlers:**
    - `handleRemoveFromWishlist`: Removes an item from the `wishlist` state based on its `itemId`. (Placeholder for API call).
    - `handleAddToCart`: Logs the item being added to the cart and then calls `handleRemoveFromWishlist` to remove it from the wishlist. (Placeholder for actual add-to-cart logic).
- **Conditional Rendering:**
    - If `wishlist` is empty, it displays an `EmptyState` component with a message and a `Heart` icon.
    - If items exist, it maps through them, displaying each item in a `Card` component.
- **Wishlist Item Display:**
    - Each wishlist card shows the product image, name, and price.
    - Provides an "Add to Cart" button with a `ShoppingCart` icon.
    - Provides a "Remove" button with an `X` icon.

## Dependencies
- `react`: Core React library (`useState`).
- `lucide-react`: Icon library (`Heart`, `ShoppingCart`, `X`).
- `../components/Button`: Reusable button component.
- `../components/Card`: Reusable card component for displaying wishlist items.
- `../components/EmptyState`: Component to display when the wishlist is empty.
