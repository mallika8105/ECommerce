# `src/admin/OrdersManagement.tsx` Context File

## Purpose
This file defines the `OrdersManagement` component, which provides administrators with an interface to view and manage customer orders. It displays a list of orders, allows viewing of detailed order information in a modal, and enables updating the status of individual orders. Data is fetched and updated via Supabase.

## Key Components/Functions
- **`OrderItem` Interface:** Defines the structure of an individual product within an order.
- **`Order` Interface:** Defines the structure of an order, including `id`, `customerName`, `date`, `status`, `total`, and an array of `items`.
- **`statusOptions` Array:** An array of objects used to populate the dropdown for changing order statuses.
- **`OrdersManagement` Component:** The main functional component for managing orders.
- **State Management:**
    - `orders`: Stores the list of `Order` objects fetched from Supabase.
    - `isModalOpen`: Controls the visibility of the order details modal.
    - `selectedOrder`: Stores the order object currently selected for viewing.
    - `loading`: Indicates if data is currently being fetched.
    - `error`: Stores any error messages during data operations.
- **`useEffect` Hook:** Calls `fetchOrders` on component mount to load initial order data.
- **`fetchOrders` Function:**
    - Asynchronously fetches all orders from the Supabase `orders` table.
    - Handles loading and error states, and updates the `orders` state.
- **Event Handlers:**
    - `handleViewDetails`: Sets the `selectedOrder` and opens the `Modal` to display order details.
    - `handleModalClose`: Closes the order details modal and clears `selectedOrder`.
    - `handleStatusChange`: Updates the `status` of a specific order in Supabase and then refetches the orders to reflect the change.
- **`getStatusIcon` Function:** A helper function that returns a `lucide-react` icon (`CheckCircle`, `Truck`, `Package`, `XCircle`, `Info`) based on the order's status, providing a visual indicator.
- **Conditional Rendering:**
    - If `orders` is empty, it displays an `EmptyState` component.
    - If orders exist, it displays them in a table within a `Card` component.
- **Orders Table:**
    - Displays order ID, customer name, date, total, and status.
    - The "Status" column uses a `Dropdown` component to allow administrators to change the order status.
    - An "Actions" column provides a "View Details" button (with an `Eye` icon) to open the order details modal.
- **Order Details Modal:** A `Modal` component that displays comprehensive information about the `selectedOrder`, including customer, date, status (with icon), total, and a list of ordered items.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `lucide-react`: Icon library (`Eye`, `Package`, `Truck`, `CheckCircle`, `XCircle`, `Info`).
- `../components/Button`: Reusable button component.
- `../components/Card`: Reusable card component.
- `../components/Dropdown`: Reusable dropdown component for status selection.
- `../components/Modal`: Reusable modal component for displaying order details.
- `../components/EmptyState`: Component to display when no orders are found.
- `../supabaseClient`: The initialized Supabase client for database interactions.
