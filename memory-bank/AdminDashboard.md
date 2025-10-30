# `src/admin/AdminDashboard.tsx` Context File

## Purpose
This file defines the `AdminDashboard` component, which acts as the main layout for the administrative section of the application. It integrates an `AdminSidebar` for navigation and uses `Outlet` to render specific admin sub-pages (like product management, order management, etc.) within a consistent dashboard structure.

## Key Components/Functions
- **`AdminDashboard` Component:** The main functional component that structures the admin interface.
- **Layout:** Uses a flexbox layout to position the `AdminSidebar` on the left and the main content area on the right.
- **`AdminSidebar`:** A component that provides navigation links specific to the admin dashboard.
- **Header:** A simple header for the main content area, displaying a breadcrumb-like navigation ("Pages / Dashboard").
- **`Outlet`:** A component from `react-router-dom` that renders the currently matched child route for the admin section. This allows for nested routing within the dashboard layout.

## Dependencies
- `react`: Core React library.
- `react-router-dom`: For routing capabilities, specifically `Outlet`.
- `./AdminSidebar`: The sidebar navigation component for the admin dashboard.
