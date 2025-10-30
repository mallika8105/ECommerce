# `src/admin/AdminLoginPage.tsx` Context File

## Purpose
This file defines the `AdminLoginPage` component, which provides a dedicated login interface for administrators. It handles admin authentication using mock credentials and integrates with the `AuthContext` to manage the admin session and redirect to the admin dashboard upon successful login.

## Key Components/Functions
- **`AdminLoginPage` Component:** The main functional component for the admin login page.
- **State Management:**
    - `email`, `password`: Store input field values for admin credentials.
    - `loading`: Indicates if a login operation is in progress.
    - `message`: Displays feedback messages (success or error) to the user.
- **`useAuth` Hook:** Consumes the authentication context to access `signIn`, `user`, and `isAdmin` status.
- **`useEffect` Hook:**
    - Redirects authenticated admin users to `/admin/dashboard`.
    - If a non-admin user is somehow logged in and lands on this page, they are redirected to the home page (`/`).
- **`handleSubmit` Function:**
    - Handles form submission for admin login.
    - Uses mock credentials (`admin@example.com`, `Admin@123`) for a simulated admin login.
    - Calls the `signIn` function from `useAuth`, which is expected to handle the mock credentials and update the `isAdmin` status within the context.
    - Sets `loading` state and displays `message` feedback.
- **UI Elements:**
    - **Card:** A reusable card component to contain the admin login form.
    - **Input:** Reusable input components for email and password.
    - **Button:** A reusable button component for submitting the login form.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `react-router-dom`: For navigation (`useNavigate`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component.
- `../context/AuthContext`: Provides authentication state and functions via `useAuth` hook.
