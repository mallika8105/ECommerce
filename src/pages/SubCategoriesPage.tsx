import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from '../supabaseClient'; // Import supabase
import "./SubCategoriesPage.css";

interface SubCategory {
  id: string;
  name: string;
  image_url: string | null;
  order_index: number; // Added order_index
}

const SubCategoriesPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categoryName, setCategoryName] = useState<string>("Loading..."); // New state for category name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndSubcategories = async () => {
      if (!categoryId) {
        setError("Category ID not provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch category name
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('name')
          .eq('id', categoryId)
          .single();

        if (categoryError) {
          console.error('Error fetching category name:', categoryError);
          setCategoryName("Error loading category name");
        } else if (categoryData) {
          setCategoryName(categoryData.name);
        } else {
          setCategoryName("Category not found");
        }

        // Fetch subcategories
        const { data: subcategoryData, error: subcategoryError } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', categoryId)
          .order('order_index', { ascending: true }); // Order by order_index

        if (subcategoryError) {
          console.error('Error fetching subcategories:', subcategoryError);
          throw new Error(subcategoryError.message);
        }

        setSubcategories(subcategoryData as SubCategory[]);
        setError(null);
      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndSubcategories();
  }, [categoryId]);

  if (loading) return <p className="loading">Loading sub-categories...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="subcategory-container">
      <h1 className="subcategory-page-title">{categoryName} Subcategories</h1> {/* Display dynamic category name */}
      {subcategories.length === 0 ? (
        <div className="no-subcategories">
          <p>No sub-categories found for this category.</p>
          <Link to={`/products/category/${categoryId}`} className="link">
            View all products for this category
          </Link>
        </div>
      ) : (
        <div className="subcategories-grid">
          {subcategories.map((s) => (
            <div key={s.id} className="subcategory-card">
              <Link
                to={`/products/subcategory/${s.id}?name=${encodeURIComponent(
                  s.name
                )}`}
                className="subcategory-link"
              >
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt={s.name}
                    className="subcategory-image"
                  />
                ) : (
                  <div className="subcategory-image placeholder">No image</div>
                )}
                <p>{s.name}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoriesPage;
