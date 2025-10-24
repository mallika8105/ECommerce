import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Star } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext'; // Import useCart

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string; // Main image
  // Assuming additional images might be stored as a JSON array of strings in the DB
  additional_images?: string[];
  rating?: number;
  category_id?: string;
  colors?: string[]; // New field for product colors
  size_chart_url?: string; // New field for size chart URL
  available_sizes?: string[]; // New field for available sizes
}

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
}

const ProductDetails: React.FC = () => {
  console.log('ProductDetails component rendering...'); // New log at the very beginning
  const { productId } = useParams<{ productId: string }>();
  console.log('ProductDetails component initialized. useParams productId:', productId); // New debug log
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // New state for selected size
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log('ProductDetails useEffect triggered. productId:', productId); // New debug log
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching product details for productId:', productId); // Log productId
      try {
        const { data, error: productError } = await supabase
          .from('products')
          .select('*') // Removed non-existent columns
          .eq('id', productId) // Reverted to original, assuming productId is a UUID
          .single();

        console.log('Supabase fetch result - data:', data, 'error:', productError); // Log fetch result

        if (productError) {
          throw new Error(productError.message);
        }

        if (data) {
          const fetchedProduct: Product = {
            ...data,
            image_url: data.image_url || 'https://via.placeholder.com/300?text=No+Image',
            additional_images: data.additional_images || [],
            colors: data.colors || [], // Initialize colors
            size_chart_url: data.size_chart_url || '', // Initialize size_chart_url
            available_sizes: data.available_sizes || [], // Initialize available_sizes
          };
          setProduct(fetchedProduct);
          setMainImage(fetchedProduct.image_url);

          if (fetchedProduct.available_sizes && fetchedProduct.available_sizes.length > 0) {
            setSelectedSize(fetchedProduct.available_sizes[0]); // Automatically select the first size
          }

          // Fetch reviews (placeholder for now)
          // In a real app, you'd fetch reviews related to this product
          setReviews([
            { id: 'r1', author: 'Alice Smith', rating: 5, comment: 'Absolutely love this product! The quality is superb.' },
            { id: 'r2', author: 'Bob Johnson', rating: 4, comment: 'Great product, exactly as described.' },
          ]);

          // Fetch related products (placeholder for now, ideally based on category)
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .neq('id', productId) // Exclude current product
            .limit(4); // Get 4 related products

          if (relatedError) {
            console.error('Error fetching related products:', relatedError.message);
          } else {
            setRelatedProducts(relatedData || []);
          }

        } else {
          setError('Product not found.');
        }
      } catch (err: any) {
        setError(`Failed to fetch product details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: quantity });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({ ...product, quantity: quantity });
      navigate('/checkout'); // Navigate to checkout page
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto p-4 text-center">
          <p>Loading product details...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto p-4 text-center">
          <p className="text-red-500">Error: {error}</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto p-4 text-center">
          <p>Product not found.</p>
        </main>
      </div>
    );
  }

  console.log('ProductDetails component rendered for productId:', productId); // Debug log

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Gallery - Left Side (smaller) */}
          <div className="lg:col-span-1">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md mb-4" />
            <div className="flex space-x-2 overflow-x-auto">
              {[product.image_url, ...(product.additional_images || [])].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-black' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Info & Description - Right Side */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-2xl text-black font-semibold mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Product Description Details (Color, Size Chart, etc.) */}
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Color:</h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Size:</h3>
                  <div className="flex space-x-2">
                    {product.available_sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 border rounded-md ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Chart Link */}
              {product.size_chart_url && (
                <div className="mb-4">
                  <Link to={product.size_chart_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Size Chart
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-24 text-center"
                label="Quantity"
              />
              <Button variant="primary" size="large" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="secondary" size="large" onClick={handleBuyNow} className="bg-red-800 hover:bg-red-900">
                Buy Now
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <div className="flex items-center mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="gold" stroke="gold" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="none" stroke="gray" />
                        ))}
                        <span className="ml-2 font-semibold text-gray-800">{review.author}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <Link to={`/product/${related.id}`} key={related.id}>
                <Card className="text-center">
                  <img src={related.image_url} alt={related.name} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{related.name}</h3>
                  <p className="text-gray-700 mb-4">${related.price.toFixed(2)}</p>
                  <Button variant="primary">View Details</Button>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
