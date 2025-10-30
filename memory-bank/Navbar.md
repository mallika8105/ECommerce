# `src/components/Navbar.tsx` Context File

## Purpose
This file defines the `Navbar` component, which serves as the primary navigation and utility bar for the e-commerce application. It includes links to various sections of the site, a search bar, user account access, a shopping cart icon with item count, and a location selection feature. It is designed to be responsive, offering both desktop and mobile menu layouts.

## Key Components/Functions
- **`Navbar` Component:** The main functional component that renders the navigation bar.
- **State Management:**
    - `cartItems` (from `useCart`): Tracks items in the shopping cart to display the total count.
    - `isLocationModalOpen`: Controls the visibility of the `LocationModal`.
    - `deliveryLocation`: Stores and displays the user's selected delivery location.
    - `isMobileMenuOpen`: Controls the visibility of the mobile navigation menu.
- **Event Handlers:**
    - `handleLocationClick`: Opens the `LocationModal`.
    - `handleLocationUpdate`: Updates the `deliveryLocation` state and closes the `LocationModal`.
    - `toggleMobileMenu`: Toggles the `isMobileMenuOpen` state for responsive navigation.
- **`useEffect` Hook:** Listens for window resize events to automatically close the mobile menu when the screen size becomes desktop-sized (>= 768px).
- **UI Elements:**
    - **Brand Logo:** "NexBuy" linked to the home page.
    - **Navigation Links:** Home, Shop, Collections, Bestsellers, About us.
    - **Search Bar:** An input field with a search icon.
    - **Account Link:** Icon and text linking to the user profile page.
    - **Cart Icon:** Displays the total number of items in the cart and toggles the `CartDrawer` on click.
    - **Location Selector:** Displays "Deliver to" and the current `deliveryLocation`, opening a `LocationModal` on click.
    - **Mobile Menu:** A hamburger icon (`Menu`) that toggles a full-screen menu on smaller screens, which transforms into a close icon (`X`) when open.
- **Responsive Design:** Utilizes CSS (from `Navbar.css`) and conditional rendering (`isMobileMenuOpen`) to adapt the layout for different screen sizes.

## Dependencies
- `react`: Core React library (`React`, `useState`, `useEffect`).
- `lucide-react`: Icon library (`ShoppingCart`, `User`, `Search`, `MapPin`, `Menu`, `X`).
- `react-router-dom`: For navigation links (`Link`).
- `../context/CartContext`: Provides `cartItems` and `toggleDrawer` via `useCart` hook.
- `./LocationModal`: A modal component for selecting/updating the delivery location.
- `./Navbar.css`: Custom CSS for styling the navbar.
