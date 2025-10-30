# `src/context/AuthContext.tsx` Context File

## Purpose
This file defines and provides an authentication context for the entire application using React's Context API. It manages user sessions, authentication status (logged in, loading, admin status), and provides functions for signing in and signing out. It integrates with Supabase for actual authentication and also includes a mock admin authentication mechanism for development/testing.

## Key Components/Functions
- **`AuthContextType` Interface:** Defines the shape of the authentication context, including `user`, `session`, `isAdmin`, `loading`, `signIn`, and `signOut`.
- **`AuthContext`:** The React context object created using `createContext`.
- **`AuthProvider` Component:**
    - Manages the state for `user`, `session`, `loading`, and `isAdmin` using `useState`.
    - **`useEffect` Hook:**
        - Initializes authentication state on component mount.
        - Checks for a mock admin session in `localStorage`. If found, it sets up a mock user and session.
        - If no mock admin session, it attempts to retrieve an existing Supabase session.
        - Determines `isAdmin` status by first checking `user_metadata.role` and then falling back to querying the `profiles` table in Supabase.
        - Sets up an `onAuthStateChange` listener from Supabase to react to authentication state changes (login, logout). This listener also updates `isAdmin` status.
    - **`checkAdminStatus` Function:** Asynchronously queries the Supabase `profiles` table to determine if a given `userId` has an 'admin' role.
    - **`signIn` Function:**
        - Handles both mock admin login (if `admin@example.com` with `Admin@123` is used) and regular Supabase `signInWithPassword`.
        - Stores mock admin session details in `localStorage`.
        - Updates `user`, `session`, and `isAdmin` states upon successful login.
        - Includes error handling and sets `loading` state.
    - **`signOut` Function:**
        - Handles clearing both mock admin session from `localStorage` and performing a regular Supabase `signOut`.
        - Clears `user`, `session`, and `isAdmin` states.
        - Includes error handling and sets `loading` state.
    - Provides the `AuthContextType` values to its children via `AuthContext.Provider`.
- **`useAuth` Hook:** A custom hook that simplifies consuming the `AuthContext`, ensuring it's used within an `AuthProvider`.

## Dependencies
- `react`: Core React library (`createContext`, `useContext`, `useState`, `useEffect`, `ReactNode`).
- `@supabase/supabase-js`: Supabase client library for authentication (`User`, `Session`, `supabase`).
- `../supabaseClient`: The initialized Supabase client instance.
