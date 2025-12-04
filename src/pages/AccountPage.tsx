import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import supabase
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';

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
          .select('name, email, phone, address, city, state, pincode')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid error when no rows

        if (error) {
          console.error('AccountPage: fetchProfile: Error fetching profile:', error);
          setUpdateMessage(`Error fetching profile: ${error.message}`);
        } else if (!data) {
          // Profile not found by ID, check if one exists with this email
          console.log('AccountPage: fetchProfile: No profile found by ID, checking by email:', user.email);
          
          const { data: emailProfile } = await supabase
            .from('profiles')
            .select('id, name, email, phone, address, city, state, pincode')
            .eq('email', user.email)
            .maybeSingle();

          if (emailProfile && isMounted) {
            // Profile exists with this email but different ID - just use the data
            console.log('AccountPage: fetchProfile: Found existing profile by email, using its data');
            setProfile(emailProfile as Profile);
            setEditName(emailProfile.name || user.user_metadata?.name || '');
            setEditEmail(emailProfile.email || user.email || '');
            setEditPhone(emailProfile.phone || user.phone || '');
            setEditAddress(emailProfile.address || '');
            setEditCity(emailProfile.city || '');
            setEditState(emailProfile.state || '');
            setEditPincode(emailProfile.pincode || '');
          } else {
            // No profile exists at all, create a new one
            console.log('AccountPage: fetchProfile: No profile found, creating new one for user:', user.id);
            const newProfile = {
              id: user.id,
              name: user.user_metadata?.name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: '',
              city: '',
              state: '',
              pincode: '',
            };

            const { data: insertedData, error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (insertError) {
              console.error('AccountPage: fetchProfile: Error creating profile:', insertError);
              setUpdateMessage(`Error creating profile: ${insertError.message}`);
            } else if (insertedData && isMounted) {
              console.log('AccountPage: fetchProfile: Profile created successfully:', insertedData);
              setProfile(insertedData as Profile);
              setEditName(insertedData.name || '');
              setEditEmail(insertedData.email || '');
              setEditPhone(insertedData.phone || '');
              setEditAddress(insertedData.address || '');
              setEditCity(insertedData.city || '');
              setEditState(insertedData.state || '');
              setEditPincode(insertedData.pincode || '');
            }
          }
        } else if (data && isMounted) {
          // Profile found, update state
          console.log('AccountPage: fetchProfile: Existing profile data found:', data);
          setProfile(data as Profile);
          setEditName(data.name || user.user_metadata?.name || '');
          setEditEmail(data.email || user.email || '');
          setEditPhone(data.phone || user.phone || '');
          setEditAddress(data.address || '');
          setEditCity(data.city || '');
          setEditState(data.state || '');
          setEditPincode(data.pincode || '');
        }
      } catch (err: any) {
        console.error('AccountPage: fetchProfile: Unexpected error:', err);
        if (isMounted) {
          setUpdateMessage(`Unexpected error: ${err.message}`);
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

      // Update the 'profiles' table for all fields
      if (profile) {
        // Profile exists - use UPDATE
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: editName,
            email: editEmail,
            phone: editPhone,
            address: editAddress,
            city: editCity,
            state: editState,
            pincode: editPincode,
          })
          .eq('id', profile.id);

        if (profileError) throw profileError;
      } else {
        // No profile exists - use INSERT
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: editName,
            email: editEmail,
            phone: editPhone,
            address: editAddress,
            city: editCity,
            state: editState,
            pincode: editPincode,
          });

        if (profileError) throw profileError;
      }

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
        <Loader text="Loading account details" />
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
            <Loader text="Loading profile data" />
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
        <p className="text-gray-600 mb-4">View and track all your orders.</p>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/my-orders')}
          className="w-full md:w-auto"
        >
          View Order History
        </Button>
      </Card>
    </div>
  );
};

export default AccountPage;
