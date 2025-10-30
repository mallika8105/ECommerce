# `src/admin/CategoryManagement.tsx` Context File

## Purpose
This file defines the `CategoryManagement` component, which provides administrators with a comprehensive interface for managing product categories. It allows for viewing, adding, editing, and deleting categories, with data persistence handled through Supabase.

## Key Components/Functions
- **`Category` Interface:** Defines the structure of a product category, including `id`, `name`, `description`, and `image_url`.
- **`CategoryManagement` Component:** The main functional component for managing categories.
- **State Management:**
    - `categories`: Stores the list of `Category` objects fetched from Supabase.
    - `isModalOpen`: Controls the visibility of the add/edit category modal.
    - `isEditMode`: Boolean to determine if the modal is for editing an existing category or adding a new one.
    - `currentCategory`: Stores the category object being edited.
    - `formData`: Stores the form input values for adding or editing a category.
    - `loading`: Indicates if data is currently being fetched or submitted.
    - `error`: Stores any error messages during data operations.
- **`useEffect` Hook:** Calls `fetchCategories` on component mount to load initial category data.
- **`fetchCategories` Function:**
    - Asynchronously fetches all categories from the Supabase `categories` table.
    - Handles loading and error states, and updates the `categories` state.
- **Event Handlers:**
    - `handleAddCategory`: Sets the modal to "add" mode, clears form data, and opens the modal.
    - `handleEditCategory`: Sets the modal to "edit" mode, populates form data with the selected category's details, and opens the modal.
    - `handleDeleteCategory`: Prompts for confirmation, then deletes a category from Supabase based on its `id`. Updates the `categories` state.
    - `handleModalClose`: Closes the add/edit category modal.
    - `handleFormChange`: Updates `formData` as the user types in the form fields.
    - `handleFormSubmit`:
        - If in edit mode, updates the `currentCategory` in Supabase with `formData`.
        - If in add mode, inserts a new category into Supabase with `formData`.
        - Refetches categories upon successful operation and closes the modal.
        - Handles errors during submission.
- **UI Elements:**
    - **"Add New Category" Button:** Triggers the `handleAddCategory` function.
    - **Loading Spinner:** Displays while categories are being fetched.
    - **Error Message:** Displays if there's an error fetching or managing categories, with a "Retry Loading" button.
    - **Empty State:** Displays if no categories are found.
    - **Categories Table:** Displays categories in a tabular format, showing name, description, and image.
    - **Action Buttons (per category):** "Edit" (with `Edit` icon) and "Delete" (with `Trash2` icon) buttons.
    - **Add/Edit Category Modal:** A `Modal` component containing a form with `Input` fields for category name, description (textarea), and image URL. Includes "Cancel" and "Save Changes" / "Add Category" buttons.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `lucide-react`: Icon library (`Edit`, `Trash2`, `PlusCircle`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component.
- `../components/Modal`: Reusable modal component for add/edit operations.
- `../components/EmptyState`: Component to display when no categories are found.
- `../supabaseClient`: The initialized Supabase client for database interactions.
