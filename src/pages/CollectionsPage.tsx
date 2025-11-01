import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './CollectionsPage.css';

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

const CollectionsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categoryOrder = [
    "Men's Fashion",
    "Women's Fashion",
    "Kid's Fashion",
    "Sports And Fitness",
    "Eyewear",
    "Electronics And Gadgets",
    "Home And Living",
    "Gifts And Occassions"
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw new Error(error.message);

        const filtered = (data || []).filter(c => c.name !== 'Casual Wear');

        const sorted = [...filtered].sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.name);
          const indexB = categoryOrder.indexOf(b.name);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        setCategories(sorted);
        setError(null);
      } catch (err: any) {
        setError(`Failed to fetch categories: ${err.message}`);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="collections-container">
        <main className="collections-main">
          <p className="loading-message">Loading categories...</p>
        </main>
      </div>
    );

  if (error)
    return (
      <div className="collections-container">
        <main className="collections-main">
          <p className="error-message">Error: {error}</p>
        </main>
      </div>
    );

  return (
    <div className="collections-container">
      <main className="collections-main">
        <h1 className="collections-title">Explore Our Categories</h1>
        {categories.length > 0 ? (
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <Link to={`/categories/${category.id}/subcategories`} className="category-link">
                  {category.image_url ? (
                    <img src={category.image_url} alt={category.name} className="category-image" />
                  ) : (
                    <div className="category-image placeholder">No image</div>
                  )}
                  <div className="category-content">
                    <h3 className="category-name">{category.name}</h3>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                  </div>
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
