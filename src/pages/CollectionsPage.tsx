import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import supabase client
import './CollectionsPage.css';

interface Category {
  id: string;
  name: string;
  description?: string; // Optional description
  image_url?: string; // Optional image URL
}

const CollectionsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Order of categories
  const categoryOrder = [
    "Men's Fashion",
    "Women's Fashion",
    "Kid's Fashion",
    "Eyewear",
    "Sports and Fitness",
    "Electronics and Gadgets",
    "Home and Living",
    "Gifts and Occasions"
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        // Sort the categories according to the specified order
        const sortedCategories = [...(data || [])].sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.name);
          const indexB = categoryOrder.indexOf(b.name);
          // If category is not in the order list, put it at the end
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        setCategories(sortedCategories);
        setError(null);
      } catch (err: any) {
        setError(`Failed to fetch categories: ${err.message}`);
        setCategories([]); // Clear categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="collections-container">
        <main className="collections-main flex justify-center items-center">
          <p className="loading-message">Loading categories...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collections-container">
        <main className="collections-main flex justify-center items-center">
          <p className="error-message">Error: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="collections-container">
      <main className="collections-main">
        <h1 className="collections-title">Explore Our Categories</h1>
        {categories.length > 0 ? (
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <Link to={`/categories/${category.id}/subcategories`}>
                  {category.image_url && (
                    <img src={category.image_url} alt={category.name} className="category-image" />
                  )}
                  <h3 className="category-name">{category.name}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-categories-found">No categories found.</p>
        )}
      </main>
    </div>
  );
};

export default CollectionsPage;
