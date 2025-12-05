import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Edit, Trash2, PlusCircle, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase client

interface Product {
  id: string;
  name: string;
  category_id: string;
  subcategory_id?: string;
  price: number;
  stock: number;
  image_url: string;
  product_code: string;
  category_name?: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
  requires_size_chart?: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
}

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'category_name'>>({
    name: '',
    category_id: '',
    subcategory_id: '',
    price: 0,
    stock: 0,
    image_url: '',
    product_code: '',
    is_featured: false,
    is_bestseller: false,
    requires_size_chart: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
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
    const { data, error } = await supabase
      .from('subcategories')
      .select('id, name, category_id')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching subcategories:', error);
    } else if (data) {
      setSubCategories(data);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
        setProducts([]);
      } else {
        console.log('Products fetched:', data);
        if (Array.isArray(data)) {
          const productsWithCategories = data.map(product => ({
            ...product,
            category_name: product.categories?.name
          }));
          setProducts(productsWithCategories);
          setError(null);
        } else {
          console.error('Unexpected data format:', data);
          setError('Invalid data format received.');
          setProducts([]);
        }
      }
    } catch (err) {
      console.error('Exception while fetching products:', err);
      setError('An unexpected error occurred.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      category_id: '',
      subcategory_id: '',
      price: 0,
      stock: 0,
      image_url: '',
      product_code: '',
      is_featured: false,
      is_bestseller: false,
      requires_size_chart: false
    });
    setFilteredSubCategories([]);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id || '',
      price: product.price,
      stock: product.stock,
      product_code: product.product_code,
      image_url: product.image_url || '',
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false,
      requires_size_chart: product.requires_size_chart || false
    });
    
    // Filter subcategories based on the product's category
    if (product.category_id) {
      const filtered = subCategories.filter(sub => sub.category_id === product.category_id);
      setFilteredSubCategories(filtered);
    }
    
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product.');
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setError(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Function to generate product code from product name
  const generateProductCode = (productName: string) => {
    // Convert to uppercase, remove special characters, replace spaces with hyphens
    const code = productName
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 20); // Limit length
    
    // Add a random 4-digit number for uniqueness
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${code}-${randomSuffix}`;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // If category changes, filter subcategories and reset subcategory selection
    if (name === 'category_id') {
      const filtered = subCategories.filter(sub => sub.category_id === value);
      setFilteredSubCategories(filtered);
      setFormData((prev) => ({
        ...prev,
        category_id: value,
        subcategory_id: '' // Reset subcategory when category changes
      }));
    } else if (name === 'name') {
      // Auto-generate product code ONLY when adding a new product (not editing)
      // In edit mode, keep the existing product code
      const generatedCode = isEditMode && currentProduct 
        ? currentProduct.product_code 
        : (value ? generateProductCode(value) : '');
      
      setFormData((prev) => ({
        ...prev,
        name: value,
        product_code: generatedCode
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? checked
          : name === 'price' || name === 'stock' 
          ? parseFloat(value) || 0
          : value
      }));
    }
  };

  // Function to format price in Indian Rupees
  const formatPrice = (price: number) => {
    const formattedPrice = new Intl.NumberFormat('en-IN').format(price);
    return `₹${formattedPrice}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate product code (excluding current product in edit mode)
    const duplicateProduct = products.find(p => 
      p.product_code === formData.product_code && 
      (!isEditMode || p.id !== currentProduct?.id)
    );
    
    if (duplicateProduct) {
      alert(`Product code "${formData.product_code}" already exists for product: "${duplicateProduct.name}". Please modify the product name to generate a unique code.`);
      return;
    }
    
    const productData = {
      name: formData.name,
      category_id: formData.category_id,
      subcategory_id: formData.subcategory_id || null,
      price: Number(formData.price),
      stock: Number(formData.stock),
      product_code: formData.product_code,
      image_url: formData.image_url || null,
      is_featured: Boolean(formData.is_featured),
      is_bestseller: Boolean(formData.is_bestseller),
      requires_size_chart: Boolean(formData.requires_size_chart)
    };

    console.log('Form Data:', formData);
    console.log('Product Data to save:', productData);

    if (isEditMode && currentProduct) {
      console.log('Updating product ID:', currentProduct.id);
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', currentProduct.id)
        .select();
      
      console.log('Update response - data:', data, 'error:', error);
      
      if (error) {
        console.error('Error updating product:', error);
        
        // Handle specific error types with user-friendly messages
        let errorMessage = 'Failed to update product.';
        if (error.code === '23505') {
          errorMessage = 'A product with this code already exists. Please use a different product name.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
        setError(errorMessage);
        return; // Don't close modal on error
      } else {
        // Even if data is empty (RLS blocking select), if no error then update succeeded
        console.log('Product updated successfully');
        await fetchProducts(); // Re-fetch products to get the updated list
        setError(null);
        
        // Show success message
        alert('Product updated successfully!');
        setIsModalOpen(false);
      }
    } else {
      console.log('Inserting new product');
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      console.log('Insert response - data:', data, 'error:', error);
      
      if (error) {
        console.error('Error adding product:', error);
        
        // Handle specific error types with user-friendly messages
        let errorMessage = 'Failed to add product.';
        if (error.code === '23505') {
          // Duplicate key error
          if (error.details?.includes('product_code')) {
            errorMessage = 'A product with this code already exists. Please modify the product name to generate a unique code.';
          } else {
            errorMessage = 'This product already exists in the database.';
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
        setError(errorMessage);
        return; // Don't close modal on error
      } else {
        console.log('Product added successfully:', data);
        await fetchProducts(); // Re-fetch products to get the new product
        setError(null);
        alert('Product added successfully!');
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-6 py-8">
        {/* Header Section with Back Button and Add Product Button */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 shadow-sm"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
            </div>
          </div>
          <div>
            <Button variant="primary" onClick={handleAddProduct}>
              <PlusCircle size={20} className="mr-2" /> Add New Product
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="p-8 bg-red-50 border border-red-200">
            <div className="text-red-600 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <X size={32} className="text-red-600" />
                </div>
              </div>
              <p className="text-lg font-semibold mb-2">Error Loading Products</p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button 
                variant="secondary" 
                className="mt-4"
                onClick={fetchProducts}
              >
                Retry Loading
              </Button>
            </div>
          </Card>
        ) : products.length === 0 ? (
          <EmptyState message="No products found. Add a new product to get started!" />
        ) : (
          <Card className="p-0 overflow-hidden bg-white shadow-sm border border-gray-200 rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">Image</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Product Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tags</th>
                    <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-14 w-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 text-xs font-medium">No img</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900 max-w-xs break-words">{product.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{product.category_name || '-'}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{product.product_code}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {product.is_featured && (
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">
                              Featured
                            </span>
                          )}
                          {product.is_bestseller && (
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 whitespace-nowrap">
                              Bestseller
                            </span>
                          )}
                          {!product.is_featured && !product.is_bestseller && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200 text-xs font-semibold"
                          >
                            <Edit size={14} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200 border border-red-200 text-xs font-semibold"
                          >
                            <Trash2 size={14} className="mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={isEditMode ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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
                <option value="">Select a category</option>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
            <div className="relative">
              <select
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleFormChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!formData.category_id}
              >
                <option value="">
                  {formData.category_id ? 'Select a sub-category (optional)' : 'Please select a category first'}
                </option>
                {filteredSubCategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
            {!formData.category_id && (
              <p className="mt-1 text-xs text-gray-500">Select a category to see available sub-categories</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Code (Auto-generated)
            </label>
            <input
              type="text"
              name="product_code"
              value={formData.product_code}
              readOnly
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                bg-gray-50 text-gray-700 cursor-not-allowed"
              placeholder="Will be generated from product name"
            />
            <p className="mt-1 text-xs text-gray-500">
              Automatically generated based on product name
            </p>
          </div>
          <Input
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleFormChange}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Price (₹)"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleFormChange}
            required
          />
          
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleFormChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-900">
                Mark as Featured Product
                <span className="block text-xs text-gray-500">Will appear in Featured Products section on homepage</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_bestseller"
                checked={formData.is_bestseller}
                onChange={handleFormChange}
                className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-900">
                Mark as Bestseller
                <span className="block text-xs text-gray-500">Will appear in Bestsellers carousel and page</span>
              </span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="requires_size_chart"
                checked={formData.requires_size_chart}
                onChange={handleFormChange}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-900">
                Requires Size Chart
                <span className="block text-xs text-gray-500">Enable size chart button for this product (e.g., clothing, shoes)</span>
              </span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
