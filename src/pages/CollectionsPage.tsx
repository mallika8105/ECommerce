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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories') // Fetch from the new 'categories' table
          .select('*');

        if (error) {
          throw new Error(error.message);
        }

        setCategories(data || []);
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
                <Link to={`/products/category/${category.id}`}>
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
