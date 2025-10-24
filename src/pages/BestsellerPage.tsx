import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../pages/BestsellerPage.css';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button'; // Import Button

const bestsellerProducts = [
  {
    id: '1', // Changed to string
    name: 'ZENEME Rhodium Plated Silver Toned American Diamond Studded Shimmery Leaf Pendant & Earring Jewellery Set for Women & Gifts For Girls',
    image: 'https://m.media-amazon.com/images/I/713cTuz4U7L._SY395_.jpg',
    price: 29.99,
    rating: 4.5,
    reviews: 120,
  },
  {
    id: '2', // Changed to string
    name: 'Cetaphil Paraben, Sulphate-Free Gentle Skin Hydrating Face Wash Cleanser with Niacinamide, Vitamin B5 for Dry to Normal, Sensitive Skin - 125 ml',
    image: 'https://m.media-amazon.com/images/I/71t9JRry+3L._SY550_.jpg',
    price: 39.99,
    rating: 4.8,
    reviews: 150,
  },
  {
    id: '3', // Changed to string
    name: 'Pedigree Adult Dry Dog Food, Chicken & Vegetables, 3 kg, Contains 37 Essential Nutrients, 100% Complete & Balanced Food for Adult Dogs',
    image: 'https://images-eu.ssl-images-amazon.com/images/I/81+YMZg8fAL._AC_UL600_SR600,400_.jpg',
    price: 19.99,
    rating: 4.2,
    reviews: 90,
  },
  {
    id: '4', // Changed to string
    name: 'Apple iPhone 15 (128 GB) - Black',
    image: 'https://m.media-amazon.com/images/I/31KxpX7Xk7L._SY300_SX300_QL70_FMwebp_.jpg',
    price: 49.99,
    rating: 4.9,
    reviews: 200,
  },
  {
    id: '5', // Changed to string
    name: 'Philips Selfie Hair Straightener I Minimized Heat Damage with SilkPro Care I Ceramic Coated Plates I No.1 Preferred Hair Styling Appliance Brand I HP8302/06',
    image: 'https://m.media-amazon.com/images/I/51KpNo662AL._SX679_.jpg',
    price: 59.99,
    rating: 4.7,
    reviews: 180,
  },
  {
    id: '6', // Changed to string
    name: 'Campus Men First Running Shoes',
    image: 'https://m.media-amazon.com/images/I/61rWcMP4s9L._SY500_.jpg',
    price: 69.99,
    rating: 4.1,
    reviews: 110,
  },
  {
    id: '7', // Changed to string
    name: "Lavie Women's Ushawu Small Satchel Handbag for Women | Satchel Bag for Work | Ladies purse | Stylish Shoulder Bag | Gift For Women",
    image: 'https://m.media-amazon.com/images/I/81SRDNUx+kL._SY575_.jpg',
    price: 79.99,
    rating: 4.6,
    reviews: 130,
  },
  {
    id: '8', // Changed to string
    name: 'ADISA Unicorn Toddler Bag Princess Cute Crossbody Handbags Gift for Girls',
    image: 'https://m.media-amazon.com/images/I/61g3Dsn+lwL._SY500_.jpg',
    price: 89.99,
    rating: 4.3,
    reviews: 160,
  },
  {
    id: '9', // Changed to string
    name: 'KLOSIA Women Embroidery Solid Anarkali Kurta and Pant Set with Dupatta',
    image: 'https://m.media-amazon.com/images/I/71DCFWHFolL._SY550_.jpg',
    price: 99.99,
    rating: 4.9,
    reviews: 210,
  },
];

const BestsellerPage: React.FC = () => {
  return (
    <div className="bestseller-page">
      <h1>Bestsellers</h1>
      <div className="bestseller-products-grid">
        {bestsellerProducts.map((product, index) => (
          <div key={product.id} className="product-card-wrapper"> {/* Added a wrapper div */}
            <ProductCard
              product={product}
              rank={index + 1}
            />
            <div className="product-actions">
              <Link to={`/products/${product.id}`}>
                <Button variant="secondary" size="small">View Details</Button>
              </Link>
              {/* Assuming there's an addToCart function available in BestsellerPage context or passed down */}
              {/* <Button variant="primary" size="small" onClick={() => addToCart(product)}>Add to Cart</Button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestsellerPage;
