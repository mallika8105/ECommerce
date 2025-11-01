import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Edit, Trash2, PlusCircle, List } from 'lucide-react'; // Added List icon
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom'; // Import Link for navigation

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  order_index: number;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    image_url: '',
    order_index: 0
  });
  // Removed selectedCategory state as we are navigating to a new page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const seedCategories = async () => {
    setLoading(true);
    try {
      const categoriesToInsert = [
        { name: "Women's fashion", description: "Fashion items specifically for women.", image_url: "" },
        { name: "Men's fashion", description: "Fashion items specifically for men.", image_url: "" },
        { name: "Kid's fashion", description: "Fashion items specifically for kids.", image_url: "" },
        { name: "Mobiles", description: "Mobile phones and accessories.", image_url: "" },
        { name: "Laptops", description: "Laptops and computer accessories.", image_url: "" },
        { name: "Electronics", description: "Electronic gadgets and devices.", image_url: "" },
        { name: "Home & Kitchen", description: "Home appliances and kitchenware.", image_url: "" },
        { name: "Beauty & Personal Care", description: "Skincare, makeup, and personal hygiene products.", image_url: "" },
        { name: "Sports & Fitness", description: "Sports equipment and fitness gear.", image_url: "" },
        { name: "Books", description: "Books from various genres.", image_url: "" },
      ];

      const { error } = await supabase
        .from('categories')
        .insert(categoriesToInsert);

      if (error) {
        console.error('Error inserting categories:', error);
        setError('Failed to add categories.');
      } else {
        console.log('Categories seeded successfully!');
        fetchCategories(); // Refresh the list
        setError(null);
      }
    } catch (err) {
      console.error('Exception while seeding categories:', err);
      setError('An unexpected error occurred during seeding.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true }); // Order by the new column

      if (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
        setCategories([]);
      } else {
        console.log('Categories fetched:', data);
        if (Array.isArray(data)) {
          setCategories(data as Category[]);
          setError(null);
        } else {
          console.error('Unexpected data format:', data);
          setError('Invalid data format received.');
          setCategories([]);
        }
      }
    } catch (err) {
      console.error('Exception while fetching categories:', err);
      setError('An unexpected error occurred.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '', image_url: '', order_index: 0 });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      order_index: category.order_index
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category.');
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
        setError(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentCategory) {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', currentCategory.id);
      
      if (error) {
        console.error('Error updating category:', error);
        setError('Failed to update category.');
      } else {
        fetchCategories();
        setError(null);
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([formData]);
      
      if (error) {
        console.error('Error adding category:', error);
        setError('Failed to add category.');
      } else {
        fetchCategories();
        setError(null);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Category Management</h1>

        <div className="flex justify-end mb-6 space-x-4">
          <Button variant="secondary" onClick={seedCategories}>
            Seed Categories
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            <PlusCircle size={20} className="mr-2" /> Add New Category
          </Button>
        </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-gray-900">{category.description}</td>
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
                      <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditCategory(category)}>
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Link to={`/admin/categories/${category.id}/subcategories`} className="inline-flex items-center space-x-1 p-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 mr-2">
                        <List size={16} className="mr-1" /> Subcategories
                      </Link>
                      <Button variant="danger" size="small" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>
      {/* Removed Subcategory Management Modal */}

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={isEditMode ? 'Edit Category' : 'Add New Category'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <Input
              name="image_url"
              value={formData.image_url}
              onChange={handleFormChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <Input
            label="Order Index"
            name="order_index"
            type="number"
            value={formData.order_index}
            onChange={handleFormChange}
            required
          />
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Save Changes' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
