# `src/admin/AdminDashboardHome.tsx` Context File

## Purpose
This file defines the `AdminDashboardHome` component, which serves as the main overview page for the administrative dashboard. It displays key e-commerce metrics, a summary chart, lists of most selling products, recent orders, and weekly top customers. It fetches data from Supabase to populate these sections.

## Key Components/Functions
- **`StatCardProps` Interface:** Defines props for the `StatCard` component.
- **`SummaryChartDataItem` Interface:** Defines the structure for data points in the summary chart.
- **`MostSellingProduct` Interface:** Defines the structure for most selling product items.
- **`RecentOrder` Interface:** Defines the structure for recent order items.
- **`WeeklyTopCustomer` Interface:** Defines the structure for weekly top customer items.
- **`StatCard` Component:** A small, reusable component to display a single key metric with its value, percentage change, and trend.
- **`AdminDashboardHome` Component:** The main functional component for the admin dashboard home page.
- **State Management:**
    - `summaryChartData`: Stores data for the sales and income growth chart.
    - `mostSellingProducts`: Stores data for the top selling products list.
    - `recentOrders`: Stores data for the list of recent orders.
    - `weeklyTopCustomers`: Stores data for the list of top customers.
    - `loading`: Indicates if data is currently being fetched.
    - `error`: Stores any error messages during data fetching.
- **`useEffect` Hook:** Triggers `fetchDashboardData` on component mount to load all necessary dashboard information.
- **`fetchDashboardData` Function:**
    - Asynchronously fetches various data points from Supabase:
        - Orders data for the summary chart.
        - User profiles data for the summary chart.
        - Product sales data for most selling products (joining `order_items` with `products`).
        - Recent orders data (joining `orders` with `order_items`).
        - Top customers data (joining `orders` with `profiles` for the last 7 days).
    - Calls helper functions (`processChartData`, `processMostSellingProducts`, `processRecentOrders`, `processTopCustomers`) to transform raw Supabase data into the format required by the UI components.
    - Handles loading and error states.
- **Helper Functions:**
    - `processChartData`: (Placeholder) Aggregates sales and new users data for the chart.
    - `processMostSellingProducts`: (Placeholder) Aggregates product sales and sorts them.
    - `processRecentOrders`: Maps raw order data to the `RecentOrder` interface, including status color.
    - `processTopCustomers`: (Placeholder) Aggregates customer orders.
    - `getStatusColor`: Returns Tailwind CSS classes for status badges based on order status.
- **UI Sections:**
    - **Header:** Displays a welcome message and options to filter data by year.
    - **Overview Metrics:** A grid of `StatCard` components showing key performance indicators (Revenue, New Customers, Repeat Purchase Rate, Average Order Value, Conversion Rate).
    - **Summary Chart:** A `LineChart` (from `recharts`) displaying trends for orders and income growth over time.
    - **Most Selling Products:** A list of top-selling products with images, names, and sales figures.
    - **Recent Orders:** A table displaying recent orders with product details, customer name, order ID, date, and status.
    - **Weekly Top Customers:** A list of customers with the most orders in the last week, including avatars, names, and order counts.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `lucide-react`: Icon library (`ArrowUp`, `ArrowDown`).
- `recharts`: Charting library (`LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`).
- `../components/Card`: Reusable card component.
- `../supabaseClient`: The initialized Supabase client for database interactions.
