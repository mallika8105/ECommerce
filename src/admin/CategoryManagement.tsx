import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Edit, Trash2, PlusCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    image_url: ''
  });
  const [subcategoryFormData, setSubcategoryFormData] = useState<Omit<Subcategory, 'id'>>({
    name: '',
    description: '',
    image_url: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        setError('Failed to fetch categories.');
        setCategories([]);
        setSubcategories([]);
      } else {
        console.log('Categories fetched:', categoriesData);
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData as Category[]);
          
          // Fetch subcategories for all categories
          const { data: subcategoriesData, error: subcategoriesError } = await supabase
            .from('subcategories')
            .select('*');

          if (subcategoriesError) {
            console.error('Error fetching subcategories:', subcategoriesError);
            setSubcategories([]);
          } else {
            console.log('Subcategories fetched:', subcategoriesData);
            if (Array.isArray(subcategoriesData)) {
              setSubcategories(subcategoriesData as Subcategory[]);
            } else {
              console.error('Unexpected subcategories data format:', subcategoriesData);
              setSubcategories([]);
            }
          }
          
          setError(null);
        } else {
          console.error('Unexpected categories data format:', categoriesData);
          setError('Invalid data format received.');
          setCategories([]);
          setSubcategories([]);
        }
      }
    } catch (err) {
      console.error('Exception while fetching data:', err);
      setError('An unexpected error occurred.');
      setCategories([]);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsEditMode(false);
    setCurrentCategory(null);
    setFormData({ name: '', description: '', image_url: '' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url
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

  const handleAddSubcategory = (category: Category) => {
    setIsEditMode(false);
    setCurrentCategory(category);
    setSubcategoryFormData({
      name: '',
      description: '',
      image_url: '',
      category_id: category.id
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
      category_id: subcategory.category_id
    });
    setIsSubcategoryModalOpen(true);
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', subcategoryId);
      
      if (error) {
        console.error('Error deleting subcategory:', error);
        setError('Failed to delete subcategory.');
      } else {
        setSubcategories((prev) => prev.filter((s) => s.id !== subcategoryId));
        setError(null);
      }
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
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
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubcategoryModalClose = () => {
    setIsSubcategoryModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubcategoryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubcategoryFormData((prev) => ({
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

  const handleSubcategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First check if we're authenticated
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        setError('You must be logged in to perform this action.');
        return;
      }

      if (isEditMode && currentSubcategory) {
        console.log('Updating subcategory:', { id: currentSubcategory.id, data: subcategoryFormData });
        const { error } = await supabase
          .from('subcategories')
          .update(subcategoryFormData)
          .eq('id', currentSubcategory.id);
        
        if (error) {
          console.error('Error updating subcategory:', error);
          setError(error.message || 'Failed to update subcategory.');
          return;
        }
      } else {
        console.log('Adding new subcategory:', subcategoryFormData);
        const { data, error } = await supabase
          .from('subcategories')
          .insert([subcategoryFormData])
          .select();
        
        if (error) {
          console.error('Error adding subcategory:', error);
          if (error.code === '42P01') {
            setError('Subcategories table does not exist. Please create it in Supabase.');
          } else if (error.code === '401') {
            setError('Authentication error. Please log in again.');
          } else {
            setError(error.message || 'Failed to add subcategory.');
          }
          return;
        }
        
        console.log('Successfully added subcategory:', data);
      }
      
      await fetchCategories();
      setError(null);
      setIsSubcategoryModalOpen(false);
    } catch (err: any) {
      console.error('Exception in subcategory submission:', err);
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Category Management</h1>

        <div className="flex justify-end mb-6">
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
                  <React.Fragment key={category.id}>
                    <tr className="hover:bg-gray-50">
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
                        <Button variant="secondary" size="small" className="mr-2" onClick={() => handleAddSubcategory(category)}>
                          <PlusCircle size={16} className="mr-1" /> Add Subcategory
                        </Button>
                        <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditCategory(category)}>
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                        <Button variant="danger" size="small" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                    {expandedCategories.has(category.id) && (
                      <>
                        {getCategorySubcategories(category.id).map(subcategory => (
                          <tr key={subcategory.id} className="bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 pl-12">
                              {subcategory.name}
                            </td>
                            <td className="px-6 py-4 text-gray-900">{subcategory.description}</td>
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
                              <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditSubcategory(subcategory)}>
                                <Edit size={16} className="mr-1" /> Edit
                              </Button>
                              <Button variant="danger" size="small" onClick={() => handleDeleteSubcategory(subcategory.id)}>
                                <Trash2 size={16} className="mr-1" /> Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {getCategorySubcategories(category.id).length === 0 && (
                          <tr className="bg-gray-50">
                            <td colSpan={4} className="px-6 py-4 text-gray-500 text-center pl-12">
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

      {/* Subcategory Modal */}
      <Modal 
        isOpen={isSubcategoryModalOpen} 
        onClose={handleSubcategoryModalClose} 
        title={isEditMode ? 'Edit Subcategory' : 'Add New Subcategory'}
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
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={subcategoryFormData.description}
              onChange={handleSubcategoryFormChange}
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <Input
              name="image_url"
              value={subcategoryFormData.image_url}
              onChange={handleSubcategoryFormChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={handleSubcategoryModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Save Changes' : 'Add Subcategory'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;