import * as React from "react";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import {
  Edit,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { supabase } from "../supabaseClient";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  display_order: number;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] =
    useState<Subcategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: "",
    description: "",
    image_url: "",
    display_order: 0,
  });
  const [subcategoryFormData, setSubcategoryFormData] = useState<
    Omit<Subcategory, "id">
  >({
    name: "",
    description: "",
    image_url: "",
    category_id: "",
    display_order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [draggedCategory, setDraggedCategory] = useState<Category | null>(null);
  const [draggedSubcategory, setDraggedSubcategory] =
    useState<Subcategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetch categories ordered by display_order
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        setError("Failed to fetch categories.");
        setCategories([]);
        setSubcategories([]);
      } else {
        // console.log("Categories fetched:", categoriesData);
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData as Category[]);

          // Fetch subcategories for all categories ordered by display_order
          const { data: subcategoriesData, error: subcategoriesError } =
            await supabase
              .from("subcategories")
              .select("*")
              .order("display_order", { ascending: true });

          if (subcategoriesError) {
            console.error("Error fetching subcategories:", subcategoriesError);
            setSubcategories([]);
          } else {
            // console.log("Subcategories fetched:", subcategoriesData);
            if (Array.isArray(subcategoriesData)) {
              setSubcategories(subcategoriesData as Subcategory[]);
            } else {
              console.error(
                "Unexpected subcategories data format:",
                subcategoriesData
              );
              setSubcategories([]);
            }
          }

          setError(null);
        } else {
          console.error("Unexpected categories data format:", categoriesData);
          setError("Invalid data format received.");
          setCategories([]);
          setSubcategories([]);
        }
      }
    } catch (err) {
      console.error("Exception while fetching data:", err);
      setError("An unexpected error occurred.");
      setCategories([]);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setFormData({ name: "", description: "", image_url: "", display_order: 0 });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      display_order: category.display_order,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category.");
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
        setError(null);
      }
    }
  };

  const handleAddSubcategory = (category: Category) => {
    setIsEditMode(false);
    setCurrentCategory(category);
    setSubcategoryFormData({
      name: "",
      description: "",
      image_url: "",
      category_id: category.id,
      display_order: 0,
    });
    setIsSubcategoryModalOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setIsEditMode(true);
    setCurrentSubcategory(subcategory);
    setSubcategoryFormData({
      name: subcategory.name,
      description: subcategory.description,
      image_url: subcategory.image_url,
      category_id: subcategory.category_id,
      display_order: subcategory.display_order,
    });
    setIsSubcategoryModalOpen(true);
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subcategoryId);

      if (error) {
        console.error("Error deleting subcategory:", error);
        setError("Failed to delete subcategory.");
      } else {
        setSubcategories((prev) => prev.filter((s) => s.id !== subcategoryId));
        setError(null);
      }
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getCategorySubcategories = (categoryId: string) => {
    return subcategories
      .filter((sub) => sub.category_id === categoryId)
      .sort((a, b) => a.display_order - b.display_order);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubcategoryModalClose = () => {
    setIsSubcategoryModalOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubcategoryFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSubcategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentCategory) {
      const { error } = await supabase
        .from("categories")
        .update(formData)
        .eq("id", currentCategory.id);

      if (error) {
        console.error("Error updating category:", error);
        setError("Failed to update category.");
      } else {
        fetchCategories();
        setError(null);
      }
    } else {
      // Get the max display_order and add 1
      const maxOrder =
        categories.length > 0
          ? Math.max(...categories.map((c) => c.display_order))
          : 0;

      const { error } = await supabase
        .from("categories")
        .insert([{ ...formData, display_order: maxOrder + 1 }]);

      if (error) {
        console.error("Error adding category:", error);
        setError("Failed to add category.");
      } else {
        fetchCategories();
        setError(null);
      }
    }
    setIsModalOpen(false);
  };

  const moveCategoryUp = async (category: Category, index: number) => {
    if (index === 0) return; // Already at top

    const prevCategory = categories[index - 1];
    const currentOrder = category.display_order;
    const prevOrder = prevCategory.display_order;

    // Swap display_order values
    await supabase
      .from("categories")
      .update({ display_order: prevOrder })
      .eq("id", category.id);

    await supabase
      .from("categories")
      .update({ display_order: currentOrder })
      .eq("id", prevCategory.id);

    await fetchCategories();
  };

  const moveCategoryDown = async (category: Category, index: number) => {
    if (index === categories.length - 1) return; // Already at bottom

    const nextCategory = categories[index + 1];
    const currentOrder = category.display_order;
    const nextOrder = nextCategory.display_order;

    // Swap display_order values
    await supabase
      .from("categories")
      .update({ display_order: nextOrder })
      .eq("id", category.id);

    await supabase
      .from("categories")
      .update({ display_order: currentOrder })
      .eq("id", nextCategory.id);

    await fetchCategories();
  };

  // Drag and drop handlers for categories
  const handleCategoryDragStart = (category: Category) => {
    // console.log("🟢 DRAG START:", category.name);
    setDraggedCategory(category);
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCategoryDrop = async (targetCategory: Category) => {
    // console.log("🔵 DROP on:", targetCategory.name);
    
    if (!draggedCategory || draggedCategory.id === targetCategory.id) {
      // console.log("❌ DROP CANCELLED - same category or no dragged category");
      setDraggedCategory(null);
      return;
    }

    // console.log("✅ VALID DROP - Reordering from", draggedCategory.name, "to", targetCategory.name);

    const draggedIndex = categories.findIndex(
      (c) => c.id === draggedCategory.id
    );
    const targetIndex = categories.findIndex((c) => c.id === targetCategory.id);

    // console.log("📊 Indices - Dragged:", draggedIndex, "Target:", targetIndex);

    // Reorder all categories
    const newOrder = [...categories];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedCategory);

    // Update display_order for all affected categories
    const updates = newOrder.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      display_order: index + 1,
    }));

    // console.log("📝 Updates to send:", updates);

    // Batch update - wait for all to complete before refreshing
    try {
      const results = await Promise.all(
        updates.map((update) =>
          supabase
            .from("categories")
            .update({ display_order: update.display_order })
            .eq("id", update.id)
        )
      );
      
      // console.log("✅ Database updates completed:", results);
    } catch (error) {
      console.error("❌ Database update error:", error);
    }

    setDraggedCategory(null);
    // console.log("🔄 Fetching updated categories...");
    await fetchCategories();
  };

  // Drag and drop handlers for subcategories
  const handleSubcategoryDragStart = (subcategory: Subcategory) => {
    setDraggedSubcategory(subcategory);
  };

  const handleSubcategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubcategoryDrop = async (
    targetSubcategory: Subcategory,
    categoryId: string
  ) => {
    if (!draggedSubcategory || draggedSubcategory.id === targetSubcategory.id) {
      setDraggedSubcategory(null);
      return;
    }
    if (draggedSubcategory.category_id !== categoryId) {
      setDraggedSubcategory(null);
      return; // Can't move between categories
    }

    const categorySubcategories = getCategorySubcategories(categoryId);
    const draggedIndex = categorySubcategories.findIndex(
      (s) => s.id === draggedSubcategory.id
    );
    const targetIndex = categorySubcategories.findIndex(
      (s) => s.id === targetSubcategory.id
    );

    // Reorder subcategories
    const newOrder = [...categorySubcategories];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedSubcategory);

    // Update display_order
    const updates = newOrder.map((sub, index) => ({
      id: sub.id,
      display_order: index + 1,
    }));

    // Batch update - wait for all to complete before refreshing
    await Promise.all(
      updates.map((update) =>
        supabase
          .from("subcategories")
          .update({ display_order: update.display_order })
          .eq("id", update.id)
      )
    );

    setDraggedSubcategory(null);
    await fetchCategories();
  };

  const moveSubcategoryUp = async (
    subcategory: Subcategory,
    categorySubcategories: Subcategory[],
    localIndex: number
  ) => {
    if (localIndex === 0) return; // Already at top

    const prevSubcategory = categorySubcategories[localIndex - 1];
    const currentOrder = subcategory.display_order;
    const prevOrder = prevSubcategory.display_order;

    // Swap display_order values
    await supabase
      .from("subcategories")
      .update({ display_order: prevOrder })
      .eq("id", subcategory.id);

    await supabase
      .from("subcategories")
      .update({ display_order: currentOrder })
      .eq("id", prevSubcategory.id);

    await fetchCategories();
  };

  const moveSubcategoryDown = async (
    subcategory: Subcategory,
    categorySubcategories: Subcategory[],
    localIndex: number
  ) => {
    if (localIndex === categorySubcategories.length - 1) return; // Already at bottom

    const nextSubcategory = categorySubcategories[localIndex + 1];
    const currentOrder = subcategory.display_order;
    const nextOrder = nextSubcategory.display_order;

    // Swap display_order values
    await supabase
      .from("subcategories")
      .update({ display_order: nextOrder })
      .eq("id", subcategory.id);

    await supabase
      .from("subcategories")
      .update({ display_order: currentOrder })
      .eq("id", nextSubcategory.id);

    await fetchCategories();
  };

  const handleSubcategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if we're authenticated (either via Supabase or mock admin)
      const adminLoggedIn = localStorage.getItem("adminLoggedIn");
      const session = await supabase.auth.getSession();
      
      if (!session.data.session && adminLoggedIn !== "true") {
        setError("You must be logged in to perform this action.");
        return;
      }

      if (isEditMode && currentSubcategory) {
        console.log("Updating subcategory:", {
          id: currentSubcategory.id,
          data: subcategoryFormData,
        });
        const { error } = await supabase
          .from("subcategories")
          .update(subcategoryFormData)
          .eq("id", currentSubcategory.id);

        if (error) {
          console.error("Error updating subcategory:", error);
          setError(error.message || "Failed to update subcategory.");
          return;
        }
      } else {
        // Get max display_order for this category's subcategories
        const categorySubcategories = subcategories.filter(
          (s) => s.category_id === subcategoryFormData.category_id
        );
        const maxOrder =
          categorySubcategories.length > 0
            ? Math.max(...categorySubcategories.map((s) => s.display_order))
            : 0;

        console.log("Adding new subcategory:", subcategoryFormData);
        const { data, error } = await supabase
          .from("subcategories")
          .insert([{ ...subcategoryFormData, display_order: maxOrder + 1 }])
          .select();

        if (error) {
          console.error("Error adding subcategory:", error);
          if (error.code === "42P01") {
            setError(
              "Subcategories table does not exist. Please create it in Supabase."
            );
          } else if (error.code === "401") {
            setError("Authentication error. Please log in again.");
          } else {
            setError(error.message || "Failed to add subcategory.");
          }
          return;
        }

        console.log("Successfully added subcategory:", data);
      }

      await fetchCategories();
      setError(null);
      setIsSubcategoryModalOpen(false);
    } catch (err: any) {
      console.error("Exception in subcategory submission:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Category Management
        </h1>

        <div className="flex justify-between mb-6">
          <Button
            variant={isReorderMode ? "danger" : "secondary"}
            onClick={() => setIsReorderMode(!isReorderMode)}
          >
            {isReorderMode ? "Done Reordering" : "Reorder Categories"}
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            <PlusCircle size={20} className="mr-2" /> Add New Category
          </Button>
        </div>

        {isReorderMode && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 font-medium">
              🔄 Reorder Mode Active: Drag and drop categories and subcategories
              to reorder them
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <Card className="p-6 bg-red-50">
            <div className="text-red-600 text-center">
              <p className="text-lg font-medium">{error}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={fetchCategories}
              >
                Retry Loading
              </Button>
            </div>
          </Card>
        ) : categories.length === 0 ? (
          <EmptyState message="No categories found. Add a new category to get started!" />
        ) : (
          <Card className="p-6 overflow-x-auto bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <tr
                      className={`hover:bg-gray-50 ${
                        isReorderMode ? "cursor-move" : ""
                      } ${
                        draggedCategory?.id === category.id ? "opacity-50" : ""
                      }`}
                      draggable={isReorderMode}
                      onDragStart={() => handleCategoryDragStart(category)}
                      onDragOver={handleCategoryDragOver}
                      onDrop={() => handleCategoryDrop(category)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isReorderMode ? (
                          <div className="flex items-center justify-center text-gray-400">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            #{index + 1}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="inline-flex items-center"
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown size={20} className="mr-2" />
                          ) : (
                            <ChevronRight size={20} className="mr-2" />
                          )}
                          {category.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.image_url && (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="secondary"
                          size="small"
                          className="mr-2"
                          onClick={() => handleAddSubcategory(category)}
                        >
                          <PlusCircle size={16} className="mr-1" /> Add
                          Subcategory
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          className="mr-2"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                    {expandedCategories.has(category.id) && (
                      <>
                        {getCategorySubcategories(category.id).map(
                          (subcategory, subIndex) => {
                            const categorySubcategories =
                              getCategorySubcategories(category.id);
                            return (
                              <tr
                                key={subcategory.id}
                                className={`bg-gray-50 ${
                                  isReorderMode ? "cursor-move" : ""
                                } ${
                                  draggedSubcategory?.id === subcategory.id
                                    ? "opacity-50"
                                    : ""
                                }`}
                                draggable={isReorderMode}
                                onDragStart={() =>
                                  handleSubcategoryDragStart(subcategory)
                                }
                                onDragOver={handleSubcategoryDragOver}
                                onDrop={() =>
                                  handleSubcategoryDrop(
                                    subcategory,
                                    category.id
                                  )
                                }
                              >
                                <td className="px-6 py-4 pl-12">
                                  {isReorderMode ? (
                                    <div className="flex items-center justify-center text-gray-400">
                                      <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-xs">
                                      #{subIndex + 1}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 pl-12">
                                  {subcategory.name}
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                  {subcategory.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {subcategory.image_url && (
                                    <img
                                      src={subcategory.image_url}
                                      alt={subcategory.name}
                                      className="h-8 w-8 rounded-full object-cover"
                                    />
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button
                                    variant="secondary"
                                    size="small"
                                    className="mr-2"
                                    onClick={() =>
                                      handleEditSubcategory(subcategory)
                                    }
                                  >
                                    <Edit size={16} className="mr-1" /> Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="small"
                                    onClick={() =>
                                      handleDeleteSubcategory(subcategory.id)
                                    }
                                  >
                                    <Trash2 size={16} className="mr-1" /> Delete
                                  </Button>
                                </td>
                              </tr>
                            );
                          }
                        )}
                        {getCategorySubcategories(category.id).length === 0 && (
                          <tr className="bg-gray-50">
                            <td
                              colSpan={5}
                              className="px-6 py-4 text-gray-500 text-center pl-12"
                            >
                              No subcategories found for this category
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={isEditMode ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <Input
              name="image_url"
              value={formData.image_url}
              onChange={handleFormChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        isOpen={isSubcategoryModalOpen}
        onClose={handleSubcategoryModalClose}
        title={isEditMode ? "Edit Subcategory" : "Add New Subcategory"}
      >
        <form onSubmit={handleSubcategoryFormSubmit} className="space-y-4">
          <Input
            label="Subcategory Name"
            name="name"
            value={subcategoryFormData.name}
            onChange={handleSubcategoryFormChange}
            required
          />
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={subcategoryFormData.description}
              onChange={handleSubcategoryFormChange}
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <Input
              name="image_url"
              value={subcategoryFormData.image_url}
              onChange={handleSubcategoryFormChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubcategoryModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? "Save Changes" : "Add Subcategory"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
