import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SubCategoryListForCategory from './SubCategoryListForCategory';
import { supabase } from '../supabaseClient'; // Import supabase

const SubCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryName, setCategoryName] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (!categoryId) {
        setError("Category ID not provided.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .eq('id', categoryId)
          .single();

        if (error) {
          console.error('Error fetching category name:', error);
          setError('Failed to fetch category name.');
        } else if (data) {
          setCategoryName(data.name);
        } else {
          setError('Category not found.');
        }
      } catch (err) {
        console.error('Exception while fetching category name:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  if (!categoryId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-lg">
        Error: Category ID not provided.
      </div>
    );
  }

  return (
    <div className="p-4">
      <SubCategoryListForCategory categoryId={categoryId} categoryName={categoryName} />
    </div>
  );
};

export default SubCategoryPage;
