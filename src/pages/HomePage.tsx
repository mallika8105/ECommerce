import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // Import Link

const HomePage: React.FC = () => {
  const { addToCart } = useCart();

  const products = [
    {
      id: '1',
      name: 'Elegant Women kurta',
      price: 1399,
      imageUrl: 'https://jaipurkurta.com/cdn/shop/files/WhatsAppImage2025-08-19at5.50.13PM_1.jpg?v=1756103854&width=990',
    },
    {
      id: '2',
      name: 'Wedge Sandals',
      price: 2999,
      imageUrl: 'https://www.dipyourtoes.in/cdn/shop/files/DSC5267.jpg?v=1741106064&width=493',
    },
    {
      id: '3',
      name: 'Silver Gold plated Pendant Earings and Chains',
      price: 4566.45,
      imageUrl: 'https://img.tatacliq.com/images/i20//437Wx649H/MP000000023922552_437Wx649H_202410011544391.jpeg',
    },
    {
      id: '4',
      name: 'Water Proof serum with 4 in 1 Palette Combo',
      price: 5599.00,
      imageUrl: 'https://aflairza.com/cdn/shop/files/4_63003d2e-4091-4c17-8481-3ecd920c1054.jpg?v=1698607084&width=1500',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 md:p-10 rounded-xl shadow-xl text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 animate-fade-in-down">Welcome to NexBuy!</h1>
          <p className="text-base md:text-xl mb-6 animate-fade-in-up">Discover amazing products and unbeatable deals.</p>
          <Link to="/products">
            <Button variant="primary" size="large" className="bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300">Shop Now</Button>
          </Link>
        </section>

        {/* Product Highlights */}
        <section className="bg-white p-4 md:p-8 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-700 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <Card key={product.id} className="text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <img src={product.imageUrl} alt={product.name} className="mx-auto mb-4 rounded-md w-32 h-32 md:w-48 md:h-48 object-contain" />
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
                <p className="text-orange-600 font-bold text-base md:text-lg mb-4">${product.price.toFixed(2)}</p>
                <Button variant="primary" onClick={() => addToCart(product)}>Add to Cart</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-purple-50 p-6 md:p-10 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-purple-800 mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Card className="bg-white p-6 shadow-md rounded-lg">
              <p className="italic text-gray-700 mb-4 text-base md:text-lg">"Amazing products and fast shipping! Highly recommend."</p>
              <p className="font-semibold text-purple-700 text-lg md:text-xl">- Jane Doe</p>
            </Card>
            <Card className="bg-white p-6 shadow-md rounded-lg">
              <p className="italic text-gray-700 mb-4 text-base md:text-lg">"I love shopping here. Great customer service and quality items."</p>
              <p className="font-semibold text-purple-700 text-lg md:text-xl">- John Smith</p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
