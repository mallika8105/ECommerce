import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import { Heart, ShoppingCart, X } from 'lucide-react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

const sampleWishlist: WishlistItem[] = [
  { id: '1', name: 'Premium Wireless Headphones', price: 199.99, imageUrl: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Smartwatch', price: 129.99, imageUrl: 'https://via.placeholder.com/150' },
];

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(sampleWishlist);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== itemId));
    console.log('Removed from wishlist:', itemId);
    // Implement API call to remove from wishlist
  };

  const handleAddToCart = (item: WishlistItem) => {
    console.log('Added to cart from wishlist:', item.name);
    // Implement add to cart logic
    // Optionally, remove from wishlist after adding to cart
    handleRemoveFromWishlist(item.id);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <EmptyState message="Your wishlist is empty." icon={<Heart size={48} className="text-gray-400" />} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {wishlist.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col items-center text-center">
                <img src={item.imageUrl} alt={item.name} className="w-32 h-32 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-lg text-gray-700 mb-4">${item.price.toFixed(2)}</p>
                <div className="flex space-x-2">
                  <Button variant="primary" size="small" onClick={() => handleAddToCart(item)}>
                    <ShoppingCart size={16} className="mr-1" /> Add to Cart
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleRemoveFromWishlist(item.id)}>
                    <X size={16} className="mr-1" /> Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
