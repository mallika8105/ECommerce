# `src/App.tsx` Context File

## Purpose
This file serves as the main entry point for the React application, defining the overall routing structure and integrating key context providers (authentication and cart). It sets up the application's layout, handles global error boundaries, and manages both public and administrative routes.

## Key Components/Functions
- **`App` Component:** The root component that sets up the `ErrorBoundary`, `BrowserRouter`, `AuthProvider`, and `CartProvider`. It also fetches the `Casual Wear` category ID from Supabase on initial load to dynamically create a route.
- **`AppContent` Component:** A functional component that consumes `useCart` to manage the `CartDrawer` state and defines all the application's routes using `react-router-dom`'s `Routes` and `Route` components.
- **Routing:**
    - **Admin Routes:** Protected routes under `/admin` for managing products, categories, orders, users, and reports. These are wrapped with `ProtectedRoute` and `AdminDashboard`.
    - **Public Routes:** User-facing routes for home, product listings, product details, authentication, cart, checkout, profile, orders, wishlist, collections, and various informational pages (About Us, Contact Us, Privacy Policy, Terms of Service). These are wrapped with the `Layout` component for consistent header/footer.
    - **Dynamic Route:** A route for `/casual-wear` is dynamically created if the `casualWearCategoryId` is successfully fetched.
    - **Fallback Route:** A 404 page for unmatched routes.
- **`useEffect` Hook:** Used in the `App` component to fetch the `Casual Wear` category ID from the Supabase `categories` table.

## Dependencies
- `react`: Core React library.
- `react-router-dom`: For client-side routing (`BrowserRouter`, `Route`, `Routes`).
- `supabaseClient`: The Supabase client for database interactions.
- `ErrorBoundary`: A component for catching and displaying UI errors.
- `AuthProvider`: Provides authentication context to the application.
- `CartProvider`, `useCart`: Provides cart management context and hooks.
- `CartDrawer`: A sidebar component for displaying cart contents.
- `Layout`: A wrapper component providing common UI elements like Navbar and Footer.
- Various page components: `HomePage`, `ProductListing`, `ProductDetails`, `AuthPage`, `CartPage`, `CheckoutPage`, `OrderConfirmation`, `ProfilePage`, `MyOrders`, `WishlistPage`, `DashboardPage`, `CollectionsPage`, `CategoryPage`, `BestsellerPage`, `SubCategoriesPage`, `AboutUsPage`, `ContactUsPage`, `PrivacyPolicyPage`, `TermsOfServicePage`.
- Various admin components: `AdminDashboardHome`, `ProductManagement`, `CategoryManagement`, `OrdersManagement`, `UserManagement`, `ReportsPage`, `AdminDashboard`, `ProtectedRoute`, `AdminLoginPage`.
