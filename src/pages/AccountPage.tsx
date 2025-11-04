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
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

const AccountPage: React.FC = () => {
  const { user, loading, session } = useAuth(); // Get session to refresh user data
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent updates after unmount

    const fetchProfile = async () => {
      console.log('AccountPage: fetchProfile triggered. loading:', loading, 'user:', !!user, 'isMounted:', isMounted);
      // Only proceed if AuthContext has finished loading AND a user is available
      if (loading || !user || !isMounted) {
        console.log('AccountPage: Skipping fetchProfile - loading:', loading, 'user:', !!user, 'isMounted:', isMounted);
        return;
      }

      setIsLoadingProfile(true);

      // Initialize edit states with current user data
      setEditName(user.user_metadata?.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');

      // Fetch additional profile data from 'profiles' table
      try {
        console.log('AccountPage: fetchProfile: Querying profiles table for user ID:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email, phone, address, city, state, pincode') // Select all fields
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('AccountPage: fetchProfile: Error fetching profile:', error);
          setUpdateMessage(`Error fetching profile: ${error.message}`);
        } else if (error && error.code === 'PGRST116') {
          // Profile not found, create a new one
          console.log('AccountPage: fetchProfile: Profile not found for user:', user.id, ', attempting to create a new one.');
          const { error: createError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name: user.user_metadata?.name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: '',
              city: '',
              state: '',
              pincode: '',
            }, { onConflict: 'id' });

          if (createError) {
            console.error('AccountPage: fetchProfile: Error creating profile:', createError);
            setUpdateMessage(`Error creating profile: ${createError.message}`);
          } else {
            console.log('AccountPage: fetchProfile: Profile created successfully for user:', user.id, '. Re-fetching profile data.');
            // Successfully created, now fetch it again
            const { data: newData, error: newFetchError } = await supabase
              .from('profiles')
              .select('name, email, phone, address, city, state, pincode')
              .eq('id', user.id)
              .single();

            if (newFetchError) {
              console.error('AccountPage: fetchProfile: Error re-fetching profile after creation:', newFetchError);
              setUpdateMessage(`Error re-fetching profile: ${newFetchError.message}`);
            } else if (newData) {
              setProfile(newData as Profile);
              setEditName(newData.name || user.user_metadata?.name || '');
              setEditEmail(newData.email || user.email || '');
              setEditPhone(newData.phone || user.phone || '');
              setEditAddress(newData.address || '');
              setEditCity(newData.city || '');
              setEditState(newData.state || '');
              setEditPincode(newData.pincode || '');
              setUpdateMessage('Profile created and fetched successfully!');
              console.log('AccountPage: fetchProfile: Re-fetched profile data:', newData);
            }
          }
        } else if (data) {
          if (isMounted) {
            setProfile(data as Profile);
            setEditName(data.name || user.user_metadata?.name || '');
            setEditEmail(data.email || user.email || '');
            setEditPhone(data.phone || user.phone || '');
            setEditAddress(data.address || '');
            setEditCity(data.city || '');
            setEditState(data.state || '');
            setEditPincode(data.pincode || '');
            console.log('AccountPage: fetchProfile: Existing profile data found:', data);
          }
        }
      } catch (err: any) {
        console.error('AccountPage: fetchProfile: Unexpected error:', err);
        if (isMounted) {
          setUpdateMessage(`Unexpected error fetching profile: ${err.message}`);
        }
      } finally {
        console.log('AccountPage: fetchProfile completed.');
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [user, loading]); // Removed 'session' to prevent infinite loop

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

      // Always update the 'profiles' table for all fields
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: editName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          city: editCity,
          state: editState,
          pincode: editPincode,
        }, { onConflict: 'id' }); // Upsert to create or update

      if (profileError) throw profileError;

      setUpdateMessage('Profile updated successfully!');
      // The AuthContext's onAuthStateChange listener should handle session updates.
      // Explicitly refreshing here might cause unnecessary re-renders or delays.

    } catch (err: any) {
      console.error('Error updating profile:', err);
      setUpdateMessage(`Failed to update profile: ${err.message || 'An unexpected error occurred.'}`);
    } finally {
      // Add a small delay to ensure UI updates correctly after message
      setTimeout(() => {
        setIsUpdating(false);
      }, 100); // 100ms delay
    }
  };

  console.log('AccountPage render - loading:', loading, 'user:', !!user);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading account details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No user found. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="account-page-container p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

      <Card className="mb-6 p-6">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        ) : (
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

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Shipping Address</h3>
              <div className="space-y-4">
                <Input
                  label="Street Address"
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  disabled={isUpdating}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="Mumbai"
                    disabled={isUpdating}
                  />
                  <Input
                    label="State"
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="Maharashtra"
                    disabled={isUpdating}
                  />
                </div>
                <Input
                  label="PIN Code"
                  type="text"
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={isUpdating} className="mt-6">
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
            {updateMessage && (
              <p className={`mt-2 text-sm ${updateMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {updateMessage}
              </p>
            )}
          </form>
        )}
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
