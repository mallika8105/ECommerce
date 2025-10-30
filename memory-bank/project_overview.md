# Project Overview: E-commerce Application

This project is a full-stack e-commerce application built with React, TypeScript, and Vite for the frontend, and likely Supabase for the backend (indicated by `supabaseClient.ts`). It features both a user-facing storefront and an administrative dashboard.

## Key Technologies:
- **Frontend:** React, TypeScript, Vite, Tailwind CSS (indicated by `tailwind.config.js`, `postcss.config.js`)
- **Backend/Database:** Supabase (indicated by `supabaseClient.ts`)
- **State Management/Context:** React Context API (indicated by `AuthContext.tsx`, `CartContext.tsx`)
- **Routing:** Likely React Router (common for React SPAs)

## Core Functionality:
- User authentication (login, signup)
- Product listing and details
- Shopping cart management
- Checkout process
- Order management (user and admin)
- Admin dashboard for managing products, categories, users, and orders.

## Project Structure Highlights:
- `src/admin/`: Contains components and pages specific to the administrative dashboard.
- `src/components/`: Reusable UI components used across the application.
- `src/context/`: React Context providers for global state management (e.g., authentication, cart).
- `src/pages/`: Top-level pages for the user-facing application.
- `src/user/`: Components and pages specific to the user interface, potentially separating from general `pages`.
- `src/supabaseClient.ts`: Configuration and initialization for Supabase client.
