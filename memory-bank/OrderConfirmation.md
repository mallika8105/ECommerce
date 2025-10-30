# `src/pages/OrderConfirmation.tsx` Context File

## Purpose
This file defines the `OrderConfirmation` component, which is displayed to the user after a successful order placement. It provides a visual confirmation, displays a placeholder order ID and total amount, and offers options to continue shopping or view past orders.

## Key Components/Functions
- **`OrderConfirmation` Component:** The main functional component for the order confirmation page.
- **Placeholder Data:**
    - `orderId`: A hardcoded string for a placeholder order ID.
    - `totalAmount`: A hardcoded string for a placeholder total amount.
- **UI Elements:**
    - **CheckCircle Icon:** A large green checkmark icon from `lucide-react` to visually signify success.
    - **Card:** A reusable card component to contain the confirmation message and details.
    - **Confirmation Message:** Displays "Order Confirmed!", a thank you message, and the placeholder order ID.
    - **Order Summary:** Shows the placeholder total amount.
    - **Action Buttons:**
        - "Continue Shopping": A primary button linking to the product listing page (`/products`).
        - "View My Orders": A secondary button linking to the user's orders page (`/orders`).

## Dependencies
- `react`: Core React library.
- `react-router-dom`: For navigation (`Link`).
- `lucide-react`: Icon library (`CheckCircle`).
- `../components/Button`: Reusable button component.
- `../components/Card`: Reusable card component.
