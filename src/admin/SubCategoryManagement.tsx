import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  image_url: string;
  description: string;
  category_name?: string; // For display purposes
}

interface Category {
  id: string;
  name: string;
}

const SubCategoryManagement: React.FC = () => {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // To select parent category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState<Omit<SubCategory, 'id' | 'category_name'>>({
    name: '',
    category_id: '',
    image_url: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else if (data) {
      setCategories(data);
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      console.log('Fetching subcategories...');
      const { data, error } = await supabase
        .from('subcategories')
        .select(`
          *,
          categories(name)
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching subcategories:', error);
        setError('Failed to fetch subcategories.');
        setSubcategories([]);
      } else {
        console.log('Subcategories fetched:', data);
        if (Array.isArray(data)) {
          const subcategoriesWithCategoryNames = data.map(subcat => ({
            ...subcat,
            category_name: subcat.categories?.name
          }));
          setSubcategories(subcategoriesWithCategoryNames);
          setError(null);
        } else {
          console.error('Unexpected data format:', data);
          setError('Invalid data format received.');
          setSubcategories([]);
        }
      }
    } catch (err) {
      console.error('Exception while fetching subcategories:', err);
      setError('An unexpected error occurred.');
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = () => {
    setIsEditMode(false);
    setCurrentSubCategory(null);
    setFormData({ name: '', category_id: '', image_url: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setIsEditMode(true);
    setCurrentSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      category_id: subCategory.category_id,
      image_url: subCategory.image_url,
      description: subCategory.description
    });
    setIsModalOpen(true);
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (window.confirm('Are you sure you want to delete this sub-category?')) {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subCategoryId);
      
      if (error) {
        console.error('Error deleting sub-category:', error);
        setError('Failed to delete sub-category.');
      } else {
        setSubcategories((prev) => prev.filter((s) => s.id !== subCategoryId));
        setError(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentSubCategory) {
      const { error } = await supabase
        .from('subcategories')
        .update(formData)
        .eq('id', currentSubCategory.id);
      
      if (error) {
        console.error('Error updating sub-category:', error);
        setError('Failed to update sub-category.');
      } else {
        fetchSubCategories();
        setError(null);
      }
    } else {
      const { error } = await supabase
        .from('subcategories')
        .insert([formData]);
      
      if (error) {
        console.error('Error adding sub-category:', error);
        setError('Failed to add sub-category.');
      } else {
        fetchSubCategories();
        setError(null);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Sub-Category Management</h1>

        <div className="flex justify-end mb-6">
          <Button variant="primary" onClick={handleAddSubCategory}>
            <PlusCircle size={20} className="mr-2" /> Add New Sub-Category
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
                onClick={fetchSubCategories}
              >
                Retry Loading
              </Button>
            </div>
          </Card>
        ) : subcategories.length === 0 ? (
          <EmptyState message="No sub-categories found. Add a new sub-category to get started!" />
        ) : (
          <Card className="p-6 overflow-x-auto bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subcategories.map((subcat) => (
                  <tr key={subcat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subcat.image_url ? (
                        <img 
                          src={subcat.image_url} 
                          alt={subcat.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{subcat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{subcat.category_name}</td>
                    <td className="px-6 py-4 text-gray-900">{subcat.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditSubCategory(subcat)}>
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDeleteSubCategory(subcat.id)}>
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

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={isEditMode ? 'Edit Sub-Category' : 'Add New Sub-Category'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Sub-Category Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
            <div className="relative">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleFormChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  bg-white text-gray-900"
                required
              >
                <option value="">Select a parent category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>
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
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Save Changes' : 'Add Sub-Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubCategoryManagement;
