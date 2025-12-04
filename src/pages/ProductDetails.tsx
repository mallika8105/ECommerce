import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Star } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext'; // Import useCart
import Loader from '../components/Loader';
import './ProductDetails.css'; // Import the custom CSS file

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string; // Main image
  product_code?: string; // Product code for order items
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

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

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
            image_url: data.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E',
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
          <Loader text="Loading product details" size="large" />
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
    <div className="product-details-page">
      <main className="product-details-main">
        <div className="product-details-container">
          {/* Product Gallery - Left Side (smaller) */}
          <div className="product-image-gallery">
            <img src={mainImage} alt={product.name} className="main-product-image" />
            <div className="thumbnail-gallery">
              {[product.image_url, ...(product.additional_images || [])].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className={`thumbnail-image ${mainImage === img ? 'selected' : ''}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Info & Description - Right Side */}
          <div className="product-info-description">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-price">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="product-description">{product.description}</p>

            {/* Product Description Details (Color, Size Chart, etc.) */}
            <div className="product-details-section">
              <h2 className="product-details-title">Product Details</h2>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="detail-item">
                  <h3 className="detail-label">Color:</h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="color-option"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="detail-item">
                  <h3 className="detail-label">Size:</h3>
                  <div className="flex space-x-2">
                    {product.available_sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
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
                <div className="detail-item">
                  <Link to={product.size_chart_url} target="_blank" rel="noopener noreferrer" className="size-chart-link">
                    View Size Chart
                  </Link>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="quantity-input"
                label="Quantity"
              />
              <Button variant="primary" size="large" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="secondary" size="large" onClick={handleBuyNow} className="buy-now-button">
                Buy Now
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h2 className="reviews-title">Customer Reviews</h2>
              {reviews.length > 0 ? (
                <div className="reviews-list">
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
                <p className="no-reviews-text">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="related-products-section">
          <h2 className="related-products-title">Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((related) => (
              <Link to={`/product/${related.id}`} key={related.id}>
                <Card className="text-center">
                  <img src={related.image_url} alt={related.name} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{related.name}</h3>
                  <p className="text-gray-700 mb-4">₹{related.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
