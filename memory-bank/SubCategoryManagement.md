# `src/admin/SubCategoryManagement.tsx` Context File

## Purpose
This file defines the `SubCategoryManagement` component, which provides administrators with an interface to manage product sub-categories. It allows for viewing, adding, editing, and deleting sub-categories, with data persistence handled through Supabase. It also enables associating sub-categories with parent categories.

## Key Components/Functions
- **`SubCategory` Interface:** Defines the structure of a sub-category, including `id`, `name`, `category_id`, `image_url`, `description`, and an optional `category_name` (for display).
- **`Category` Interface:** Defines the structure of a parent category, including `id` and `name`.
- **`SubCategoryManagement` Component:** The main functional component for managing sub-categories.
- **State Management:**
    - `subcategories`: Stores the list of `SubCategory` objects fetched from Supabase.
    - `categories`: Stores the list of parent `Category` objects fetched from Supabase, used for the parent category dropdown in the form.
    - `isModalOpen`: Controls the visibility of the add/edit sub-category modal.
    - `isEditMode`: Boolean to determine if the modal is for editing an existing sub-category or adding a new one.
    - `currentSubCategory`: Stores the sub-category object being edited.
    - `formData`: Stores the form input values for adding or editing a sub-category.
    - `loading`: Indicates if data is currently being fetched or submitted.
    - `error`: Stores any error messages during data operations.
- **`useEffect` Hook:** Calls `fetchCategories` and `fetchSubCategories` on component mount to load initial data.
- **`fetchCategories` Function:** Asynchronously fetches all parent categories from the Supabase `categories` table.
- **`fetchSubCategories` Function:**
    - Asynchronously fetches all sub-categories from the Supabase `subcategories` table.
    - Uses a Supabase join (`select('*, categories(name)')`) to fetch the parent category name along with sub-category details.
    - Maps the fetched data to include `category_name` in the `SubCategory` interface.
    - Handles loading and error states, and updates the `subcategories` state.
- **Event Handlers:**
    - `handleAddSubCategory`: Sets the modal to "add" mode, clears form data, and opens the modal.
    - `handleEditSubCategory`: Sets the modal to "edit" mode, populates form data with the selected sub-category's details, and opens the modal.
    - `handleDeleteSubCategory`: Prompts for confirmation, then deletes a sub-category from Supabase based on its `id`. Updates the `subcategories` state.
    - `handleModalClose`: Closes the add/edit sub-category modal.
    - `handleFormChange`: Updates `formData` as the user types in the form fields.
    - `handleFormSubmit`:
        - If in edit mode, updates the `currentSubCategory` in Supabase with `formData`.
        - If in add mode, inserts a new sub-category into Supabase with `formData`.
        - Refetches sub-categories upon successful operation and closes the modal.
        - Handles errors during submission.
- **UI Elements:**
    - **"Add New Sub-Category" Button:** Triggers the `handleAddSubCategory` function.
    - **Loading Spinner, Error Message, Empty State:** Conditional rendering for various data states.
    - **Sub-Categories Table:** Displays sub-categories in a tabular format, showing image, name, parent category, and description.
    - **Action Buttons (per sub-category):** "Edit" (with `Edit` icon) and "Delete" (with `Trash2` icon) buttons.
    - **Add/Edit Sub-Category Modal:** A `Modal` component containing a form with `Input` fields for sub-category name, description (textarea), image URL, and a `select` dropdown for parent category selection. Includes "Cancel" and "Save Changes" / "Add Sub-Category" buttons.

## Dependencies
- `react`: Core React library (`useState`, `useEffect`).
- `lucide-react`: Icon library (`Edit`, `Trash2`, `PlusCircle`).
- `../components/Button`: Reusable button component.
- `../components/Input`: Reusable input component.
- `../components/Card`: Reusable card component.
- `../components/Modal`: Reusable modal component for add/edit operations.
- `../components/EmptyState`: Component to display when no sub-categories are found.
- `../supabaseClient`: The initialized Supabase client for database interactions.
