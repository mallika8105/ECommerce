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
  category: string;
  price: number;
  stock: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products.');
      setProducts([]);
    } else {
      setProducts(data as Product[]);
      setError(null);
    }
    setLoading(false);
  };

  const handleAddProduct = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setFormData({ name: '', category: '', price: 0, stock: 0 });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentProduct) {
      const { error } = await supabase
        .from('products')
        .update(formData)
        .eq('id', currentProduct.id);
      if (error) {
        console.error('Error updating product:', error);
        setError('Failed to update product.');
      } else {
        fetchProducts(); // Re-fetch products to get the updated list
        setError(null);
      }
    } else {
      const { error } = await supabase.from('products').insert([formData]);
      if (error) {
        console.error('Error adding product:', error);
        setError('Failed to add product.');
      } else {
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

        {products.length === 0 ? (
          <EmptyState message="No products found. Add a new product to get started!" />
        ) : (
          <Card className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="small" className="mr-2" onClick={() => handleEditProduct(product)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 size={16} />
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
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Price"
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
