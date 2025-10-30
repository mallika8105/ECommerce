# `src/supabaseClient.ts` Context File

## Purpose
This file is responsible for initializing and exporting the Supabase client instance. It retrieves the Supabase URL and anonymous key from environment variables, ensuring that the application can connect to the Supabase backend. It also configures authentication options for session persistence and auto-refresh.

## Key Components/Functions
- **`createClient`:** A function from `@supabase/supabase-js` used to create and configure a Supabase client.
- **`supabaseUrl` and `supabaseAnonKey`:** Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) that hold the Supabase project URL and public anonymous key, respectively. These are crucial for connecting to the Supabase project.
- **Error Handling:** A check is performed to ensure that the required Supabase environment variables are present; otherwise, an error is thrown.
- **`supabase` Export:** The configured Supabase client instance is exported for use throughout the application.
- **Authentication Configuration:** The `auth` object within `createClient` configuration sets:
    - `persistSession: true`: Ensures user sessions are persisted across browser sessions.
    - `autoRefreshToken: true`: Automatically refreshes authentication tokens.
    - `storageKey: 'ecommerce-admin-auth'`: Specifies a custom key for storing authentication data in local storage.

## Dependencies
- `@supabase/supabase-js`: The official JavaScript client library for Supabase.
- `import.meta.env`: Vite's way of accessing environment variables.
