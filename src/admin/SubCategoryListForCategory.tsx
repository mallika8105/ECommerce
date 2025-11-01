import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal'; // Import Modal
import EmptyState from '../components/EmptyState';
import { Edit, Trash2, PlusCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  image_url: string;
  description: string;
  order_index: number;
}

interface SubCategoryListForCategoryProps {
  categoryId: string;
  categoryName: string;
}

const SubCategoryListForCategory: React.FC<SubCategoryListForCategoryProps> = ({ categoryId, categoryName }) => {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState<Omit<SubCategory, 'id'>>({
    name: '',
    category_id: categoryId,
    image_url: '',
    description: '',
    order_index: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId]);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching subcategories:', error);
        setError('Failed to fetch subcategories.');
        setSubcategories([]);
      } else {
        console.log('Fetched subcategories:', data); // Log fetched data
        setSubcategories(data as SubCategory[]);
        setError(null);
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
    setFormData({ name: '', category_id: categoryId, image_url: '', description: '', order_index: subcategories.length });
    setIsModalOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setIsEditMode(true);
    setCurrentSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      category_id: subCategory.category_id,
      image_url: subCategory.image_url,
      description: subCategory.description,
      order_index: subCategory.order_index
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
        fetchSubCategories(); // Re-fetch to update order_index if needed
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
      [name]: name === 'order_index' ? parseInt(value, 10) : value
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
        .insert([{ ...formData, category_id: categoryId }]);
      
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

  const handleMoveSubCategory = async (subCategory: SubCategory, direction: 'up' | 'down') => {
    const currentIndex = subcategories.findIndex(s => s.id === subCategory.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < subcategories.length) {
      const updatedSubcategories = [...subcategories];
      const [movedSubCategory] = updatedSubcategories.splice(currentIndex, 1);
      updatedSubcategories.splice(newIndex, 0, movedSubCategory);

      // Update order_index for all affected subcategories in the local state first
      const reorderedSubcategories = updatedSubcategories.map((subcat, index) => ({
        ...subcat,
        order_index: index
      }));
      setSubcategories(reorderedSubcategories); // Optimistic UI update

      // Prepare updates for the database, including all required fields
      const updates = reorderedSubcategories.map(subcat => ({
        id: subcat.id,
        name: subcat.name,
        category_id: subcat.category_id,
        image_url: subcat.image_url,
        description: subcat.description,
        order_index: subcat.order_index
      }));

      console.log('Sending updates to Supabase:', updates); // Log updates being sent

      const { error } = await supabase
        .from('subcategories')
        .upsert(updates, { onConflict: 'id', ignoreDuplicates: false }); // Ensure all fields are updated

      if (error) {
        console.error('Error updating subcategory order:', error);
        setError('Failed to update subcategory order.');
      } else {
        console.log('Subcategory order updated successfully.'); // Log success
        fetchSubCategories(); // Re-fetch to ensure UI is consistent with DB
        setError(null);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Subcategories for "{categoryName}"</h2>

        <div className="flex justify-end mb-6 space-x-4">
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
          <EmptyState message={`No sub-categories found for "${categoryName}". Add a new sub-category to get started!`} />
        ) : (
          <Card className="p-6 overflow-x-auto bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subcategories.map((subcat, index) => (
                  <tr key={subcat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span>{subcat.order_index + 1}</span>
                        <div className="flex flex-col">
                          <Button 
                            variant="secondary" // Changed to secondary
                            size="small" 
                            onClick={() => handleMoveSubCategory(subcat, 'up')} 
                            disabled={index === 0}
                            className="p-1"
                          >
                            <ArrowUp size={16} />
                          </Button>
                          <Button 
                            variant="secondary" // Changed to secondary
                            size="small" 
                            onClick={() => handleMoveSubCategory(subcat, 'down')} 
                            disabled={index === subcategories.length - 1}
                            className="p-1"
                          >
                            <ArrowDown size={16} />
                          </Button>
                        </div>
                      </div>
                    </td>
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

      {/* Modal for Add/Edit Subcategory */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={isEditMode ? 'Edit Sub-Category' : 'Add New Sub-Category'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Sub-Category Name"
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
              {isEditMode ? 'Save Changes' : 'Add Sub-Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubCategoryListForCategory;
