import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { Star } from 'lucide-react';

const product = {
  id: '1',
  name: 'Premium Wireless Headphones',
  price: 199.99,
  description: 'Experience immersive sound with these premium wireless headphones. Featuring noise-cancellation and a comfortable over-ear design, perfect for music lovers and professionals alike.',
  images: [
    'https://via.placeholder.com/300/0000FF/FFFFFF?text=Headphones+Front',
    'https://via.placeholder.com/300/FF0000/FFFFFF?text=Headphones+Side',
    'https://via.placeholder.com/300/00FF00/FFFFFF?text=Headphones+Back',
  ],
  reviews: [
    { id: 'r1', author: 'Alice Smith', rating: 5, comment: 'Absolutely love these headphones! The sound quality is superb.' },
    { id: 'r2', author: 'Bob Johnson', rating: 4, comment: 'Great headphones, comfortable and good battery life.' },
  ],
  relatedProducts: [
    { id: 'rp1', name: 'Bluetooth Speaker', price: 89.99, imageUrl: 'https://via.placeholder.com/150' },
    { id: 'rp2', name: 'Smartwatch', price: 129.99, imageUrl: 'https://via.placeholder.com/150' },
  ],
};

const ProductDetails: React.FC = () => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    // Implement add to cart logic
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <div>
            <img src={mainImage} alt={product.name} className="w-full h-96 object-cover rounded-lg shadow-md mb-4" />
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Info & Add to Cart */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-2xl text-blue-600 font-semibold mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

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
            </div>

            {/* Reviews Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
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
            {product.relatedProducts.map((related) => (
              <Card key={related.id} className="text-center">
                <img src={related.imageUrl} alt={related.name} className="mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{related.name}</h3>
                <p className="text-gray-700 mb-4">${related.price.toFixed(2)}</p>
                <Button variant="primary">View Details</Button>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
