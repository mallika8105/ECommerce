# `src/pages/AuthPage.tsx` Context File

## Purpose
This file defines the `AuthPage` component, which provides user authentication functionalities including login, registration, and social login (Google). It integrates with Supabase for backend authentication and uses the `AuthContext` to manage the user's session and redirection.

## Key Components/Functions
- **`AuthPage` Component:** The main functional component for the authentication page.
- **State Management:**
    - `isLogin`: Boolean to toggle between login and registration forms.
    - `email`, `password`, `confirmPassword`: Store input field values.
    - `loading`: Indicates if an authentication operation is in progress.
    - `message`: Displays feedback messages (success or error) to the user.
- **`useAuth` Hook:** Consumes the authentication context to access `signIn`, `user`, and `isAdmin` status.
- **`useEffect` Hook:** Redirects authenticated users based on their `isAdmin` status. If `user` is present, it navigates to `/admin/dashboard` for admins or `/dashboard` for regular users.
- **`handleSubmit` Function:**
    - Handles form submission for both login and registration.
    - For login, it calls `signIn` from `useAuth`.
    - For registration, it uses `supabase.auth.signUp`.
    - Includes password confirmation for registration.
    - Sets `loading` state and displays `message` feedback.
- **`handleSocialLogin` Function:**
    - Initiates OAuth sign-in with a specified provider (e.g., 'google') using `supabase.auth.signInWithOAuth`.
    - Sets a `redirectTo` URL for the OAuth flow.
    - Sets `loading` state and displays `message` feedback.
- **UI Elements:**
    - **Card:** A reusable card component to contain the authentication form.
    - **Input:** Reusable input components for email, password, and confirm password.
    - **Button:** Reusable button components for form submission and social login.
    - **Toggle Button:** Allows users to switch between login and registration forms.
    - **Social Login Button:** A button for "Continue with Google" using the `Chrome` icon.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `react-router-dom`: For navigation (`useLocation`, `useNavigate`).
- `lucide-react`: Icon library (`Chrome`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component.
- `../context/AuthContext`: Provides authentication state and functions via `useAuth` hook.
- `../supabaseClient`: The initialized Supabase client for authentication operations.
