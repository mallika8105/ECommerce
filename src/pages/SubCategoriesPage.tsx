import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './SubCategoriesPage.css';

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  image_url?: string;
  description?: string;
}

const SubCategoriesPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchSubcategories = async () => {
      setLoading(true);
      try {
        // Assumes a `subcategories` table with a `category_id` foreign key
        const { data, error } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', categoryId);

        if (error) throw error;

        console.log('Fetched subcategories:', data); // Debugging line

        const desiredOrder = [
          "Shirts",
          "T-Shirts and Polos",
          "Jeans and Trousers",
          "Suits & Blazers",
          "SportsWear",
          "Accessories",
          "Footwear"
        ];

        const sortedSubcategories = (data || []).sort((a, b) => {
          const nameA = a.name.trim().toLowerCase();
          const nameB = b.name.trim().toLowerCase();

          const lowerCaseDesiredOrder = desiredOrder.map(name => name.toLowerCase());

          const indexA = lowerCaseDesiredOrder.indexOf(nameA);
          const indexB = lowerCaseDesiredOrder.indexOf(nameB);

          // Handle cases where a subcategory might not be in the desiredOrder list
          if (indexA === -1 && indexB === -1) return 0; // Both not in list, maintain original relative order
          if (indexA === -1) return 1; // a not in list, b comes first
          if (indexB === -1) return -1; // b not in list, a comes first

          return indexA - indexB;
        });

        console.log('Sorted subcategories:', sortedSubcategories); // Debugging line

        setSubcategories(sortedSubcategories);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch subcategories', err);
        setError('Failed to load sub-categories.');
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  if (!categoryId) return <div className="p-6">Invalid category.</div>;

  return (
    <div className="subcategories-page-container">
      <main className="subcategories-main">
        <h1 className="subcategories-title">Sub-categories</h1>

        {loading ? (
          <p className="loading">Loading sub-categories...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : subcategories.length === 0 ? (
          <div className="no-subcategories">
            <p>No sub-categories found for this category.</p>
            <p>You can still view all products for the category <Link to={`/products/category/${categoryId}`} className="link">here</Link>.</p>
          </div>
        ) : (
          <div className="subcategories-grid">
            {subcategories.map((s) => (
              <div key={s.id} className="subcategory-card">
                <Link to={`/products/subcategory/${s.id}`} className="subcategory-link">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} className="subcategory-image" />
                  ) : (
                    <div className="subcategory-image placeholder">No image</div>
                  )}
                  <h3 className="subcategory-name">{s.name}</h3>
                  {s.description && <p className="subcategory-desc">{s.description}</p>}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SubCategoriesPage;
