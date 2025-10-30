# `src/pages/MyOrders.tsx` Context File

## Purpose
This file defines the `MyOrders` component, which allows authenticated users to view a list of their past orders. It displays a summary of each order and provides a way to view detailed information about a selected order through a modal.

## Key Components/Functions
- **`OrderItem` Interface:** Defines the structure of an individual product within an order.
- **`Order` Interface:** Defines the structure of an order, including `id`, `date`, `status`, `total`, and an array of `items`.
- **`sampleOrders` Array:** A hardcoded array of sample order data for demonstration purposes.
- **`MyOrders` Component:** The main functional component for the "My Orders" page.
- **State Management:**
    - `orders`: Stores the list of user orders (currently initialized with `sampleOrders`).
    - `isModalOpen`: Controls the visibility of the order details modal.
    - `selectedOrder`: Stores the details of the order currently selected for viewing in the modal.
- **Event Handlers:**
    - `handleViewDetails`: Sets the `selectedOrder` and opens the `Modal` to display order details.
    - `handleModalClose`: Closes the `Modal` and clears `selectedOrder`.
- **`getStatusIcon` Function:** A helper function that returns a `lucide-react` icon (`CheckCircle`, `Truck`, `Package`, `Info`) based on the order's status, providing a visual indicator.
- **Conditional Rendering:**
    - If `orders` is empty, it displays an `EmptyState` component with a message.
    - If orders exist, it maps through them, displaying each order in a `Card` component.
- **Order Display:**
    - Each order card shows the order ID, date, status (with an icon), and total.
    - A "View Details" button opens a `Modal` with a more comprehensive breakdown of the selected order, including all items.

## Dependencies
- `react`: Core React library (`useState`).
- `lucide-react`: Icon library (`Package`, `Truck`, `CheckCircle`, `Info`).
- `../components/Button`: Reusable button component.
- `../components/Card`: Reusable card component for displaying individual orders.
- `../components/Modal`: Reusable modal component for displaying order details.
- `../components/EmptyState`: Component to display when no orders are found.
