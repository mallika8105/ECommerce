import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Additional products to be displayed
  const additionalProducts: Product[] = [
    {
      id: '401',
      name: 'Wireless Headphones',
      price: 199.99,
      imageUrl: 'https://sp.yimg.com/ib/th?id=OPAC.ICd60GJ9ieKdsA474C474&o=5&pid=21.1&w=160&h=105',
    },
    {
      id: '402',
      name: 'Smartwatch',
      price: 149.99,
      imageUrl: 'https://sp.yimg.com/ib/th?id=OPAC.5MiyI2nEUF2F4Q474C474&o=5&pid=21.1&w=160&h=105',
    },
    {
      id: '403',
      name: 'Ergonomic Office Chair',
      price: 250.00,
      imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.DEHuzNjxLt38mDdmf9V7bwHaHa?pid=Api&P=0&h=180',
    },
    {
      id: '404',
      name: 'Stainless Steel Water Bottle',
      price: 25.00,
      imageUrl: 'https://sp.yimg.com/ib/th?id=OPAC.v0wcLVrdqhIaow474C474&o=5&pid=21.1&w=160&h=105',
    },
    {
      id: '405',
      name: 'Yoga Mat',
      price: 40.00,
      imageUrl: 'https://sp.yimg.com/ib/th?id=OPAC.lLcZrhq6aPnbkg474C474&o=5&pid=21.1&w=160&h=105',
    },
    {
      id: '406',
      name: 'Gaming Mouse',
      price: 50.00,
      imageUrl: 'https://sp.yimg.com/ib/th?id=OPAC.%2fsh27AjbSS0gVg474C474&o=5&pid=21.1&w=160&h=105',
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products') // Assuming your table name is 'products'
        .select('*');

      if (error) {
        setError(error.message);
        setProducts(additionalProducts); // Display only additional products on error
      } else {
        const fetchedProducts = data || [];
        const fetchedProductIds = new Set(fetchedProducts.map(p => p.id));
        const uniqueAdditionalProducts = additionalProducts.filter(p => !fetchedProductIds.has(p.id));
        setProducts([...fetchedProducts, ...uniqueAdditionalProducts]); // Combine fetched and unique additional products
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Log the products array to debug
  console.log("Products being rendered:", products.map(p => ({ id: p.id, name: p.name, imageUrl: p.imageUrl })));

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 md:p-6 flex justify-center items-center">
          <p className="text-xl text-gray-700">Loading products...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 md:p-6 flex justify-center items-center">
          <p className="text-xl text-red-600">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 md:mb-8 text-center">All Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <img src={product.imageUrl} alt={product.name} className="mx-auto mb-4 rounded-md w-32 h-32 md:w-48 md:h-48 object-contain" />
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
                <p className="text-orange-600 font-bold text-base md:text-lg mb-4">${product.price.toFixed(2)}</p>
                <Button variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-xl text-gray-700">No products found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListing;
