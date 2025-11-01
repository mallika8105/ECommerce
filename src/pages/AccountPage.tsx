import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import supabase
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

const AccountPage: React.FC = () => {
  const { user, loading, session } = useAuth(); // Get session to refresh user data
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      // Initialize edit states with current user data
      setEditName(user.user_metadata?.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || ''); // Supabase user object might have phone directly

      // Fetch additional profile data from 'profiles' table
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email, phone') // Select relevant fields
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching profile:', error);
          setUpdateMessage(`Error fetching profile: ${error.message}`);
        } else if (error && error.code === 'PGRST116') {
          // Profile not found, create a new one
          console.log('Profile not found, attempting to create a new one.');
          const { error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name: user.user_metadata?.name || '',
              email: user.email || '',
              phone: user.phone || '',
            }, { onConflict: 'id' });

          if (createError) {
            console.error('Error creating profile:', createError);
            setUpdateMessage(`Error creating profile: ${createError.message}`);
          } else {
            // Successfully created, now fetch it again
            const { data: newData } = await supabase
              .from('profiles')
              .select('name, email, phone')
              .eq('id', user.id)
              .single();
            if (newData) {
              setProfile(newData as Profile);
              setEditName(newData.name || user.user_metadata?.name || '');
              setEditEmail(newData.email || user.email || '');
              setEditPhone(newData.phone || user.phone || '');
              setUpdateMessage('Profile created successfully!');
            }
          }
        } else if (data) {
          setProfile(data as Profile);
          setEditName(data.name || user.user_metadata?.name || '');
          setEditEmail(data.email || user.email || '');
          setEditPhone(data.phone || user.phone || '');
        }
      } catch (err: any) {
        console.error('Unexpected error fetching profile:', err);
        setUpdateMessage(`Unexpected error fetching profile: ${err.message}`);
      } finally {
        console.log('fetchProfile completed. Profile data:', profile);
        console.log('fetchProfile completed. User:', user);
      }
    };

    fetchProfile();
  }, [user, session]); // Re-fetch if user or session changes

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth'); // Redirect to login if not authenticated
    }
  }, [loading, user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    if (!user) {
      setUpdateMessage('You must be logged in to update your profile.');
      setIsUpdating(false);
      return;
    }

    try {
      // Update auth.users metadata (for name) and email/phone if changed
      // Only update auth.users metadata for name and email if changed
      const updates: { data?: { name?: string }, email?: string } = {};
      let authUpdateNeeded = false;

      if (editName !== (user.user_metadata?.name || '')) {
        updates.data = { name: editName };
        authUpdateNeeded = true;
      }
      if (editEmail !== (user.email || '')) {
        updates.email = editEmail;
        authUpdateNeeded = true;
      }

      if (authUpdateNeeded) {
        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }

      // Always update the 'profiles' table for name, email, and phone

      // Also update the 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: editName,
          email: editEmail,
          phone: editPhone,
        }, { onConflict: 'id' }); // Upsert to create or update

      if (profileError) throw profileError;

      setUpdateMessage('Profile updated successfully!');
      // Refresh user session to get updated metadata
      await supabase.auth.refreshSession();

    } catch (err: any) {
      console.error('Error updating profile:', err);
      setUpdateMessage(`Failed to update profile: ${err.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <p>Loading account details...</p>;
  }

  return (
    <div className="account-page-container p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

      <Card className="mb-6 p-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            disabled={isUpdating}
          />
          <Input
            label="Email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
            disabled={isUpdating}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            disabled={isUpdating}
          />
          <Button type="submit" variant="primary" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
          {updateMessage && (
            <p className={`mt-2 text-sm ${updateMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {updateMessage}
            </p>
          )}
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        <p>Your past orders will appear here.</p>
        {/* Placeholder for order list */}
        <div className="mt-4">
          <p className="text-gray-600">No orders found yet.</p>
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;
