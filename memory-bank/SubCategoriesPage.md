# `src/pages/SubCategoriesPage.tsx` Context File

## Purpose
This file defines the `SubCategoriesPage` component, which displays a list of sub-categories belonging to a specific parent category. It fetches sub-category data from Supabase based on the `categoryId` provided in the URL parameters and sorts them according to a predefined order.

## Key Components/Functions
- **`SubCategory` Interface:** Defines the structure of a sub-category, including `id`, `name`, `category_id`, `image_url`, and `description`.
- **`SubCategoriesPage` Component:** The main functional component for displaying sub-categories.
- **`useParams` Hook:** Extracts the `categoryId` from the URL.
- **State Management:**
    - `subcategories`: Stores the list of `SubCategory` objects fetched from Supabase.
    - `loading`: Indicates if data is currently being fetched.
    - `error`: Stores any error messages during data fetching.
- **`useEffect` Hook:**
    - Triggers `fetchSubcategories` when the `categoryId` changes.
    - **`fetchSubcategories` Function:**
        - Asynchronously fetches sub-categories from the Supabase `subcategories` table, filtering by `category_id`.
        - Includes a `desiredOrder` array for specific sub-category names ("Shirts", "T-Shirts & Polos", "Jeans & Trousers", "Suits & Blazers", "Sportswear", "Accessories", "Footwear").
        - Sorts the fetched sub-categories based on this `desiredOrder`, ensuring that items present in the list appear first and in the specified sequence.
        - Handles cases where sub-categories might not be in the `desiredOrder` list.
        - Handles loading and error states, and updates the `subcategories` state.
- **Conditional Rendering:**
    - Displays "Invalid category" if `categoryId` is missing.
    - Displays loading messages, error messages, or a "No sub-categories found" message.
    - If sub-categories exist, it renders them in a grid, each as a `Link` to its respective product listing page (`/products/subcategory/:id`).
- **Sub-category Card Display:** Each card shows the sub-category image (or a placeholder), name, and description.

## Dependencies
- `react`: Core React library (`useEffect`, `useState`).
- `react-router-dom`: For routing (`useParams`, `Link`).
- `../supabaseClient`: The initialized Supabase client for database interactions.
- `./SubCategoriesPage.css`: Custom CSS for styling the sub-categories page.
