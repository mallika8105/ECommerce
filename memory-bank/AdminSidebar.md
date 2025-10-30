# `src/admin/AdminSidebar.tsx` Context File

## Purpose
This file defines the `AdminSidebar` component, which provides the navigation menu for the administrative dashboard. It allows administrators to easily navigate between different management sections (dashboard, users, products, categories, orders, reports) and includes links to account-related pages and a logout button.

## Key Components/Functions
- **`AdminSidebar` Component:** The main functional component that renders the fixed sidebar navigation.
- **`useLocation` Hook:** From `react-router-dom`, used to get the current URL path to highlight the active navigation item.
- **`navItems` Array:** An array of objects defining the main navigation links for the admin dashboard, each with a `path`, `icon` (from `lucide-react`), and `label`.
- **`accountPages` Array:** An array of objects defining links for account-related pages (e.g., Profile, Sign In).
- **UI Elements:**
    - **Brand Logo:** "NexBuy" with a custom SVG icon, linked to the admin dashboard home.
    - **Main Navigation:** A list of links generated from `navItems`, with active links styled differently based on `location.pathname`.
    - **Account Pages Section:** A separate section for account-related links.
    - **Logout Button:** A button at the bottom of the sidebar for logging out, styled with a `LogOut` icon.

## Dependencies
- `react`: Core React library.
- `lucide-react`: Icon library (`Home`, `ShoppingBag`, `Users`, `Package`, `BarChart2`, `LogOut`, `User`, `LogIn`).
- `react-router-dom`: For navigation (`Link`, `useLocation`).
