# `src/admin/ProductManagement.tsx` Context File (Updated)

## Purpose
This file defines the `ProductManagement` component, which provides administrators with a comprehensive interface for managing products. It allows for viewing, adding, editing, and deleting products, with data persistence handled through Supabase. It now integrates with both category and sub-category data to allow products to be assigned to specific categories and sub-categories.

## Key Components/Functions
- **`Product` Interface:** Defines the structure of a product, now including `subcategory_id` and `subcategory_name` (for display).
- **`Category` Interface:** Defines the structure of a category, including `id` and `name`.
- **`SubCategory` Interface:** Defines the structure of a sub-category, including `id`, `name`, and `category_id` (to filter subcategories by parent category).
- **`ProductManagement` Component:** The main functional component for managing products.
- **State Management:**
    - `products`: Stores the list of `Product` objects fetched from Supabase.
    - `categories`: Stores the list of `Category` objects fetched from Supabase, used for the category dropdown in the form.
    - `subcategories`: **New state** to store the list of `SubCategory` objects fetched from Supabase, used for the sub-category dropdown.
    - `isModalOpen`: Controls the visibility of the add/edit product modal.
    - `isEditMode`: Boolean to determine if the modal is for editing an existing product or adding a new one.
    - `currentProduct`: Stores the product object being edited.
    - `formData`: Stores the form input values for adding or editing a product, now including `subcategory_id`.
    - `loading`: Indicates if data is currently being fetched or submitted.
    - `error`: Stores any error messages during data operations.
- **`useEffect` Hook:** Calls `fetchCategories`, `fetchSubCategories`, and `fetchProducts` on component mount to load initial data.
- **`fetchCategories` Function:** Asynchronously fetches all categories from the Supabase `categories` table.
- **`fetchSubCategories` Function:** **New function** to asynchronously fetch all sub-categories from the Supabase `subcategories` table.
- **`fetchProducts` Function:**
    - Asynchronously fetches all products from the Supabase `products` table.
    - Uses Supabase joins (`select('*, categories(name), subcategories(name)')`) to fetch both category and sub-category names along with product details.
    - Maps the fetched data to include `category_name` and `subcategory_name` in the `Product` interface.
    - Handles loading and error states, and updates the `products` state.
- **Event Handlers:**
    - `handleAddProduct`: Resets `formData` including `subcategory_id`, and opens the modal.
    - `handleEditProduct`: Populates `formData` including `subcategory_id` from the selected product, and opens the modal.
    - `handleDeleteProduct`: Deletes a product from Supabase.
    - `handleModalClose`: Closes the modal.
    - `handleFormChange`: Updates `formData` for all fields, including `subcategory_id`.
    - `handleFormSubmit`: Submits product data to Supabase, now including `subcategory_id`. Refetches products on success.
- **`formatPrice` Function:** A helper function to format product prices in Indian Rupees.
- **`filteredSubcategories` Constant:** **New logic** to filter the `subcategories` list based on the currently selected `category_id` in the form, ensuring only relevant sub-categories are shown.
- **UI Elements:**
    - **Products Table:** Now includes a "Sub-Category" column to display `product.subcategory_name`.
    - **Add/Edit Product Modal:**
        - Includes a **new dropdown for "Sub-Category"** that is conditionally rendered based on whether a parent category is selected.
        - The sub-category dropdown options are dynamically filtered by the selected parent category.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `lucide-react`: Icon library (`Edit`, `Trash2`, `PlusCircle`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component.
- `../components/Modal`: Reusable modal component for add/edit operations.
- `../components/EmptyState`: Component to display when no products are found.
- `../supabaseClient`: The initialized Supabase client for database interactions.
