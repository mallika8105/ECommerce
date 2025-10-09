import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Import SearchBar component
import './ProductList.css'; // Assuming ProductList.css will be created

// Placeholder for product data structure
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductListPage: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ category: '', priceRange: '' });
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); // Number of products to display per page

  // Handler for search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Effect to update filteredProducts when the 'products' prop changes
  useEffect(() => {
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when products list changes
  }, [products]);

  // Effect to apply filters and sorting
  useEffect(() => {
    let results = [...products]; // Start with the original products list

    // Filter by search query
    if (searchQuery) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category) {
      results = results.filter(product => product.category === filters.category);
    }

    // Filter by price range (simple example)
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      results = results.filter(product => product.price >= min && product.price <= max);
    }

    // Sort products
    results.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    setFilteredProducts(results);
    setCurrentPage(1); // Reset to first page when filters/sort/search change
  }, [filters, sortBy, products, searchQuery]); // Depend on products, filters, sort, and search query

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as typeof sortBy);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="product-list-container">
      <h1>Our Products</h1>

      <div className="controls-container">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Filters */}
        <div className="filters">
          <label htmlFor="category-filter">Category:</label>
          <select id="category-filter" name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="Apparel">Apparel</option>
            <option value="Footwear">Footwear</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Electronics">Electronics</option>
            <option value="Fitness">Fitness</option>
            <option value="Accessories">Accessories</option>
          </select>

          <label htmlFor="price-filter">Price Range:</label>
          <select id="price-filter" name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
            <option value="">All Prices</option>
            <option value="0-20"> $0 - $20</option>
            <option value="20-50">$20 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-1000">$200+</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="sorting">
          <label htmlFor="sort-by">Sort by:</label>
          <select id="sort-by" value={sortBy} onChange={handleSortChange}>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {currentProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <p className="product-category">{product.category}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
