import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './ProfilePage.css';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile>(profile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          // Parse address if it's stored as JSON string
          let addressData = data.address;
          if (typeof addressData === 'string') {
            try {
              addressData = JSON.parse(addressData);
            } catch {
              addressData = {};
            }
          }

          setProfile({
            fullName: data.full_name || '',
            email: user.email || '',
            phone: data.phone || '',
            addressLine1: addressData?.addressLine1 || '',
            addressLine2: addressData?.addressLine2 || '',
            city: addressData?.city || '',
            state: addressData?.state || '',
            zipCode: addressData?.zipCode || '',
            country: addressData?.country || '',
          });
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditClick = () => {
    setEditFormData(profile);
    setIsEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editFormData.fullName,
          phone: editFormData.phone,
          address: JSON.stringify({
            addressLine1: editFormData.addressLine1,
            addressLine2: editFormData.addressLine2,
            city: editFormData.city,
            state: editFormData.state,
            zipCode: editFormData.zipCode,
            country: editFormData.country,
          }),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(editFormData);
      setSuccess('Profile updated successfully!');
      setIsEditModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 profile-page-main">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>

        {success && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {success}
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 font-semibold">Full Name:</p>
                <p className="text-gray-800">{profile.fullName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Email:</p>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Phone:</p>
                <p className="text-gray-800">{profile.phone || 'Not set'}</p>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Address</h3>
            <div className="space-y-2">
              {profile.addressLine1 ? (
                <>
                  <p className="text-gray-800">{profile.addressLine1}</p>
                  {profile.addressLine2 && <p className="text-gray-800">{profile.addressLine2}</p>}
                  <p className="text-gray-800">
                    {profile.city}, {profile.state} {profile.zipCode}
                  </p>
                  <p className="text-gray-800">{profile.country}</p>
                </>
              ) : (
                <p className="text-gray-500">No address added yet</p>
              )}
            </div>
            
            <Button variant="secondary" className="mt-6" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <Button variant="secondary">Change Password</Button>
              <Button variant="danger">Delete Account</Button>
            </div>
          </Card>
        </div>
      </main>

      <Modal isOpen={isEditModalOpen} onClose={handleModalClose} title="Edit Profile">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            name="fullName"
            value={editFormData.fullName}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={editFormData.email}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Phone Number *"
            name="phone"
            type="tel"
            value={editFormData.phone}
            onChange={handleFormChange}
            required
          />
          
          <h3 className="text-lg font-semibold text-gray-800 mt-4">Address</h3>
          
          <Input
            label="Address Line 1 *"
            name="addressLine1"
            value={editFormData.addressLine1}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Address Line 2 (Optional)"
            name="addressLine2"
            value={editFormData.addressLine2}
            onChange={handleFormChange}
          />
          <Input
            label="City *"
            name="city"
            value={editFormData.city}
            onChange={handleFormChange}
            required
          />
          <Input
            label="State/Province *"
            name="state"
            value={editFormData.state}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Zip/Postal Code *"
            name="zipCode"
            value={editFormData.zipCode}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Country *"
            name="country"
            value={editFormData.country}
            onChange={handleFormChange}
            required
          />
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
