import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase client

interface Product {
  id: string;
  name: string;
  category_id: string;
  price: number;
  stock: number;
  image_url: string;
  product_code: string;
  category_name?: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
}

interface Category {
  id: string;
  name: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'category_name'>>({
    name: '',
    category_id: '',
    price: 0,
    stock: 0,
    image_url: '',
    product_code: '',
    is_featured: false,
    is_bestseller: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
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
      price: 0,
      stock: 0,
      image_url: '',
      product_code: '',
      is_featured: false,
      is_bestseller: false
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
      product_code: product.product_code,
      image_url: product.image_url || '',
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false
    });
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked
        : name === 'price' || name === 'stock' 
        ? parseFloat(value) || 0
        : value
    }));
  };

  // Function to format price in Indian Rupees
  const formatPrice = (price: number) => {
    const formattedPrice = new Intl.NumberFormat('en-IN').format(price);
    return `₹${formattedPrice}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      category_id: formData.category_id,
      price: Number(formData.price),
      stock: Number(formData.stock),
      product_code: formData.product_code,
      image_url: formData.image_url || null,
      is_featured: Boolean(formData.is_featured),
      is_bestseller: Boolean(formData.is_bestseller)
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
        setError('Failed to update product: ' + error.message);
      } else {
        // Even if data is empty (RLS blocking select), if no error then update succeeded
        console.log('Product updated successfully');
        await fetchProducts(); // Re-fetch products to get the updated list
        setError(null);
        
        // Show success message
        alert('Product updated successfully!');
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
        setError('Failed to add product: ' + error.message);
      } else {
        console.log('Product added successfully:', data);
        fetchProducts(); // Re-fetch products to get the new product
        setError(null);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Product Management</h1>

        <div className="flex justify-end mb-6">
          <Button variant="primary" onClick={handleAddProduct}>
            <PlusCircle size={20} className="mr-2" /> Add New Product
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
                onClick={fetchProducts}
              >
                Retry Loading
              </Button>
            </div>
          </Card>
        ) : products.length === 0 ? (
          <EmptyState message="No products found. Add a new product to get started!" />
        ) : (
          <Card className="p-6 overflow-x-auto bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.product_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {product.is_featured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditProduct(product)}>
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDeleteProduct(product.id)}>
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
          <Input
            label="Product Code"
            name="product_code"
            value={formData.product_code}
            onChange={handleFormChange}
            required
          />
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
